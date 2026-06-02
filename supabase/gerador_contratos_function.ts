import OpenAI from "https://esm.sh/openai";

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const body = await req.json();

    const tipo = (body.tipo_contrato || "").toLowerCase();
    const descricao = body.descricao || "DADO NÃO PREENCHIDO";
    const pagamento = body.forma_pagamento || "DADO NÃO PREENCHIDO";
    const prazo = body.data_entrega || "DADO NÃO PREENCHIDO";

    const parte1 = body.parte_1 || body.dados_parte_1 || "DADO NÃO PREENCHIDO";
    const parte2 = body.parte_2 || body.dados_parte_2 || "DADO NÃO PREENCHIDO";

    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    let contratoBase = "";

    if (tipo.includes("loca")) {
      contratoBase = `
CONTRATO PARTICULAR DE LOCAÇÃO

LOCADOR:
${parte2}

LOCATÁRIO:
${parte1}

As partes acima identificadas resolvem firmar o presente contrato de locação, que se regerá pelas cláusulas seguintes:

CLÁUSULA 1 - DO OBJETO
O presente contrato tem como objeto a locação do seguinte bem:
${descricao}

CLÁUSULA 2 - DO PRAZO
O prazo da locação será conforme estipulado abaixo:
${prazo}

CLÁUSULA 3 - DO VALOR E PAGAMENTO
O valor ajustado para a locação é:
${pagamento}

CLÁUSULA 4 - DAS OBRIGAÇÕES DO LOCATÁRIO
O LOCATÁRIO obriga-se a:
- Zelar pela conservação do bem
- Utilizar conforme sua finalidade
- Restituir nas mesmas condições em que recebeu
- Arcar com despesas decorrentes do uso

CLÁUSULA 5 - DAS OBRIGAÇÕES DO LOCADOR
O LOCADOR obriga-se a:
- Entregar o bem em condições de uso
- Garantir o uso pacífico durante o contrato

CLÁUSULA 6 - DA RESCISÃO
O descumprimento de quaisquer obrigações implicará rescisão imediata do contrato, podendo gerar multa conforme legislação aplicável.

CLÁUSULA 7 - DAS PENALIDADES
Em caso de inadimplência ou descumprimento, a parte infratora poderá responder por perdas, danos e encargos legais.

CLÁUSULA 8 - DO FORO
Fica eleito o foro do domicílio das partes, com renúncia de qualquer outro.

DATA: ${dataAtual}
`;
    } else if (tipo.includes("venda") || tipo.includes("compra")) {
      contratoBase = `
CONTRATO PARTICULAR DE COMPRA E VENDA

VENDEDOR:
${parte1}

COMPRADOR:
${parte2}

As partes acima identificadas têm, entre si, justo e acordado o presente contrato de compra e venda, que se regerá pelas cláusulas seguintes:

CLÁUSULA 1 - DO OBJETO
O presente contrato tem como objeto a venda do seguinte bem:
${descricao}

CLÁUSULA 2 - DA PROPRIEDADE E GARANTIAS
O VENDEDOR declara, sob as penas da lei, que é legítimo proprietário do bem, livre e desembaraçado de quaisquer ônus, dívidas ou gravames, responsabilizando-se por evicção de direito.

CLÁUSULA 3 - DO VALOR E FORMA DE PAGAMENTO
O valor certo e ajustado para a presente transação é:
${pagamento}

CLÁUSULA 4 - DA ENTREGA
A entrega do bem ocorrerá conforme as condições abaixo:
${prazo}

CLÁUSULA 5 - DAS OBRIGAÇÕES DO COMPRADOR
O COMPRADOR obriga-se a:
- Efetuar o pagamento conforme pactuado
- Zelar pelo bem após a entrega
- Assumir responsabilidades após a transferência

CLÁUSULA 6 - DAS OBRIGAÇÕES DO VENDEDOR
O VENDEDOR obriga-se a:
- Entregar o bem nas condições ajustadas
- Garantir a legitimidade da propriedade
- Responder por vícios ocultos, se houver

CLÁUSULA 7 - DA RESCISÃO E MULTA
O descumprimento de qualquer cláusula implicará rescisão contratual, sujeitando a parte infratora ao pagamento de multa e eventuais perdas e danos.

CLÁUSULA 8 - DO FORO
Fica eleito o foro do domicílio das partes para dirimir quaisquer controvérsias oriundas deste contrato.

DATA: ${dataAtual}
`;
    } else {
      contratoBase = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE:
${parte1}

CONTRATADO:
${parte2}

As partes acima identificadas celebram o presente contrato de prestação de serviços, que se regerá pelas cláusulas seguintes:

CLÁUSULA 1 - DO OBJETO
O presente contrato tem como objeto a prestação dos seguintes serviços:
${descricao}

CLÁUSULA 2 - DO PRAZO
A execução dos serviços ocorrerá conforme:
${prazo}

CLÁUSULA 3 - DA REMUNERAÇÃO
Pela execução dos serviços, o CONTRATANTE pagará ao CONTRATADO o valor de:
${pagamento}

CLÁUSULA 4 - DAS OBRIGAÇÕES DO CONTRATADO
O CONTRATADO obriga-se a:
- Executar os serviços com qualidade e diligência
- Cumprir os prazos estabelecidos
- Atuar conforme as normas legais aplicáveis

CLÁUSULA 5 - DAS OBRIGAÇÕES DO CONTRATANTE
O CONTRATANTE obriga-se a:
- Efetuar os pagamentos conforme acordado
- Fornecer informações necessárias para execução dos serviços

CLÁUSULA 6 - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes mediante descumprimento contratual ou acordo entre as partes.

CLÁUSULA 7 - DO FORO
Fica eleito o foro do domicílio das partes para dirimir eventuais controvérsias.

DATA: ${dataAtual}
`;
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "Gere o contrato em HTML profissional com <h2>, <h3>, <p style='text-align: justify;'> e <strong> nos títulos das cláusulas. Não invente informações. Retorne APENAS o HTML limpo, sem marcações markdown.",
        },
        { role: "user", content: contratoBase },
      ],
    });

    const contratoHTML = ai.choices?.[0]?.message?.content
      ?.replace(/```html/g, '')
      ?.replace(/```/g, '')
      ?.trim() || "<p>Erro ao gerar contrato</p>";

    const htmlLimpo = contratoHTML.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, '');

    const htmlCompleto = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.5; }
        h2 { text-align: center; font-size: 22px; text-transform: uppercase; margin-bottom: 30px; }
        h3 { font-size: 16px; margin-top: 20px; text-transform: uppercase; }
        p { text-align: justify; font-size: 14px; margin-bottom: 15px; }
        strong { font-weight: bold; }
      </style>
    </head>
    <body>
      ${htmlLimpo}
    </body>
    </html>
    `;

    const n8nResponse = await fetch("https://contratoia.app.n8n.cloud/webhook/contrato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlCompleto,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error("Falha na comunicação com o n8n");
    }

    const result = await n8nResponse.json();

    return new Response(
      JSON.stringify({
        pdf_url: result.pdf_url || "ERRO_PDF",
        docx_url: result.docx_url || "ERRO_DOCX",
      }),
      { headers, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        pdf_url: "Erro na geração", 
        docx_url: "Erro na geração" 
      }),
      { headers, status: 500 }
    );
  }
});