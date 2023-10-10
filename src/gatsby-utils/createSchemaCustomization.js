const {
    pagesDefs,
    contentDefs,
    generalDefs,
    matchDefs,
    gamesDefs,
    articlesDefs,
    playersDefs,
} = require("./typedefs");

const mdResolverPassthrough =
    (fieldName) => async (source, args, context, info) => {
        const type = info.schema.getType(`MarkdownRemark`);
        const mdNode = context.nodeModel.getNodeById({
            id: source.parent,
        });
        const resolver = type.getFields()[fieldName].resolve;
        const result = await resolver(mdNode, args, context, info);
        return result;
    };

module.exports = async ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;
    createFieldExtension({
        name: "mdpassthrough",
        args: {
            fieldName: `String!`,
        },
        extend({ fieldName }) {
            return {
                resolve: mdResolverPassthrough(fieldName),
            };
        },
    });

    const allTypeDefs = [
        pagesDefs,
        contentDefs,
        generalDefs,
        matchDefs,
        gamesDefs,
        articlesDefs,
        playersDefs,
    ];

    createTypes(allTypeDefs);
};
