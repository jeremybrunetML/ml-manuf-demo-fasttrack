export const ResultsSnippetConfig = {
    entityTypeConfig: {
        path: 'extracted.content[0].Part.*~' // child key of extracted
    },
    entities: [
        {
            entityType: 'Part',
            title: {
                path: 'extracted.content[0].Part.PieceNom'
            }
        }
    ]
}

export default ResultsSnippetConfig;