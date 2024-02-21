import { parse } from "https://tsm.deno.dev/https://deno.land/std@0.215.0/csv/mod.ts"

const googleSheet = (id: string) => fetch(
    `https://docs.google.com/spreadsheets/u/0/d/${id}/export?format=csv`
).then(x => x.text())

const toTable = (csv: string) => {
    const [header, ...body] = parse(csv)
    return [
        header.map(x => `
            <th scope="col">
                ${x}
            </th>
        `),
        ...body.map(raw => raw.map(cell => `
            <td>${cell}</td>
        `))
    ].map(raw => `<tr>${raw.join("")}</tr>`)
    .join("")
}

const toHtml = (csv: string) => `
    <!doctype html>
    <html>
        <head>
            <style>
                table {
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <table>
                ${toTable(csv)}
            </table>
        </body>
    </html>
`

Deno.serve(async (req: Request) => {
    const url = new URL(req.url)
    const id = url.pathname.substring(1)

    if (req.headers.get("accept")?.includes("html")) {
        return new Response(
            toHtml(await googleSheet(id)), 
            {
                headers: new Headers({
                    "content-type": "text/html;charset=utf-8",
                    "access-control-allow-origin": "*",
                }),
            }
        )
    } else {
        return new Response(
            await googleSheet(id), 
            {
                headers: new Headers({
                    "content-type": "text/csv",
                    "access-control-allow-origin": "*",
                }),
            }
        )
    }
})