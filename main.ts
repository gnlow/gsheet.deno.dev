const googleSheet = (id: string) => fetch(
    `https://docs.google.com/spreadsheets/u/0/d/${id}/export?format=csv`
).then(x => x.text())

Deno.serve(async (req: Request) => {
    const url = new URL(req.url)
    const id = url.pathname.substring(1)

    return new Response(
        await googleSheet(id), 
        {
            headers: new Headers({
                "content-type": "text/csv",
                "access-control-allow-origin": "*",
            }),
        }
    )
})