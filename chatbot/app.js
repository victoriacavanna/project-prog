const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "messages", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")


const flowMenuServicios = addKeyword(EVENTS.ACTION)
    .addAnswer('flow servicios')

const flowMenuResevar = addKeyword(EVENTS.ACTION)
    .addAnswer('flow reservas')

const flowMenuConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('flow consultas')



    
const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer(" ", {
        delay: 100
    },
        async (ctx, ctxFn) => {
            if (ctxFn.body.includes("palabra")) {

                await ctxFn.flowDynamic("Escribiste palabra")
            } else {
                await ctxFn.flowDynamic("Escribiste otra cosa")
            }
        }
    )

const menuFlow = addKeyword("Menu").addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            )
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowMenuServicios)
            case "2":
                return gotoFlow(flowMenuResevar)
            case "3":
                return gotoFlow(flowMenuConsultas)
            case "0":
                return await flowDynamic(
                    "Saliendo... puedes volver a este menu escribiendo '*Menu*'...",
                )
        }
    }
)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowWelcome, menuFlow, flowMenuConsultas, flowMenuResevar, flowMenuServicios])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
