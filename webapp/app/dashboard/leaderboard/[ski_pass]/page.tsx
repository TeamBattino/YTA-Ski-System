import PageBuilder from "./PageBuilder";


async function Page(
    {
        params,
    }: {
        params: Promise<{ ski_pass: string, race_id: string }>
    }) {
    const ski_pass = (await params).ski_pass
    const race_id = (await params).race_id
    return <PageBuilder ski_pass={ski_pass} race_id={race_id} />
}

export default Page