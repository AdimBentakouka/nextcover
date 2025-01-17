export const MetadataAPIExample = {
    search: [
        {
            title: 'ONE-PUNCH MAN - tome 02',
            description:
                "Saitama est trop puissant, tellement puissant qu'il élimine tous les monstres les plus farouches avec un simple coup de poing. Découvrez l'histoire du plus puissant des super-héros dans ce manga qui va vous mettre K.O. !! Le plus grand des secrets est sur le point d'être révélé ! Après avoir affronté plusieurs adversaires, Saitama et Genos pénètrent dans le repaire de la Maison de l'évolution où ils vont devoir faire face à Scaravageur, l'ultime de vie artificielle. Alors que Genos se fait éliminer en une fraction de seconde, Saitama va-t-il enfin pouvoir passer auxchoses sérieuses et montrer sa véritable puissance?",
            authors: 'One,Yusuke Murata',
            thumbnail:
                'http://books.google.com/books/content?id=mm_XDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
            tags: 'Comics & Graphic Novels',
            isbn: '9782823877540',
            infoLink:
                'https://play.google.com/store/books/details?id=mm_XDwAAQBAJ&source=gbs_api',
        },
        {
            title: 'ONE-PUNCH MAN - tome 08',
            description:
                "Saitama est trop puissant, tellement puissant qu'il élimine tous les monstres les plus farouches avec un simple coup de poing. Découvrez l'histoire du plus puissant des super-héros dans ce manga qui va vous mettre K.O. !! On raconte que King, le héros de classe S, est l'homme le plus fort du monde. Même les monstres les plus vilains tremblent devant lui. Mais une mystérieuse organisation a fait appel à un assassin afin de le tuer... Comment vont réagir Genos et Saitama ?! Voici l'incroyable vérité concernant King !!",
            authors: 'One,Yusuke Murata',
            thumbnail:
                'http://books.google.com/books/content?id=41TbDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
            tags: 'Comics & Graphic Novels',
            isbn: '9782823877601',
            infoLink:
                'https://play.google.com/store/books/details?id=41TbDwAAQBAJ&source=gbs_api',
        },
    ],
    validationError: {
        message: [
            {
                property: 'identifier',
                children: [],
                constraints: {
                    isEnum: 'identifier must be one of the following values: ISBN, Title',
                },
            },
            {
                property: 'metadataStrategy',
                children: [],
                constraints: {
                    isEnum: 'metadataStrategy must be one of the following values: Google Books API',
                },
            },
        ],
        error: 'Bad Request',
        statusCode: 400,
    },
};
