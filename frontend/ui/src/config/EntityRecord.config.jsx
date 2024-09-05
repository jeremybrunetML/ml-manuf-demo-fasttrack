export const entityRecordConfig = {
  entityTypeConfig: {
    path: "data.envelope.instance.info.title", // child key of root
  },
  entities: [
    {
      entityType: "Part",
      entityTypeDisplay: "Part",
      title: {
        path: "data.envelope.instance.Part.PieceNom",
      },
      // image: {
      //   path: 'person.images.image[0].url'
      // },
      items: [
        {
          label: "Materiau",
          path: "data.envelope.instance.Part.Materiau",
        },
        {
          label: "MasseKg",
          path: "data.envelope.instance.Part.MasseKg",
        },
        {
          label: "VolumeMm3",
          path: "data.envelope.instance.Part.VolumeMm3",
        },
        {
          label: "PieceNom",
          path: "data.envelope.instance.Part.PieceNom",
        },
        {
          label: "partImage",
          path: "data.envelope.instance.Part.partImage",
        },
      ],
      avatarProps: {
        border: false,
        themeColor: "info",
        rounded: "full",
        type: "image",
        style: { flexBasis: 140, height: 140 },
        avatarImage: {
          path: "$.partImage",
          alt: "data.envelope.instance.Part.PieceNom",
        },
      },
    },
  ],
};

export default entityRecordConfig;
