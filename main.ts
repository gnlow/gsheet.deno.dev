import { parse } from "https://deno.land/std@0.215.0/csv/mod.ts"

const googleSheet = async (id: string) => {
    const data = await fetch(`https://docs.google.com/spreadsheets/u/0/d/${id}/export?format=csv`).then(x => x.text())

    return parse(data)
}

Deno.serve((req: Request) => {
    const url = new URL(req.url)
    return new Response(url.href, {
        headers: new Headers({
            "content-type": "text/csv",
            "access-control-allow-origin": "*",
        }),
    })
})