import { z } from 'zod';

export const getData = async (name: string) => {
    const response = await fetch("http://localhost:3000/api/journalists?name=" + name)
    const data = await response.json()
    console.log(data)
    return data
}

export const getDataGraph = async (name: string) => {
    const response = await fetch("https://epic-weevil-67.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "6auz5oSy7T4sQid5CXQijrOKZP2P7yjeV1RpEyl57rxN7rMvOayrqcGNZxLML3uI"
        },
        body: JSON.stringify({
            query: `
                query MyQuery($name: String!) {
                    journalist(where: {name: {_eq: $name}}) {
                      id
                      name
                      password
                    }
                  }
              `,
            variables: {
                name: name,
            },
        }),
    })
    const data = await response.json()
    console.log(data)
    return []
    return data.data.journalist
}

export const getArticlesWithComments = async () => {
    return Promise.resolve([
        {
            title: "alma",
            subtitle: "korte",
            content: "barack",
            image: "barack",
            shortContent: "barack",
            journalists: [],
            comments: []
        },
        {
            title: "alma1",
            subtitle: "korte1",
            content: "barack1",
            image: "barack1",
            shortContent: "barack1",
            journalists: [],
            comments: []
        },
        {
            title: "alma2",
            subtitle: "korte2",
            content: "barack2",
            image: "barack2",
            shortContent: "barack2",
            journalists: [],
            comments: []
        },
    ])
    const response = await fetch("https://epic-weevil-67.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "6auz5oSy7T4sQid5CXQijrOKZP2P7yjeV1RpEyl57rxN7rMvOayrqcGNZxLML3uI"
        },
        body: JSON.stringify({
            query: `
                query GetArticlesWithComments {
                    article {
                    id
                    image
                    content
                    title
                    subtitle
                    created_at
                    journalists {
                        journalist {
                        name
                        }
                    }
                    comments {
                        content
                        created_at
                        likes
                        user {
                        username
                        }
                    }
                    }
                }
              `,
        }),
    })
    const data = await response.json()
    console.log(data)
    return data.data.article
}

/* Zod example  --- https://zod.dev/?id=introduction

const User = z.object({
    username: z.string(),
  });
  
  User.parse({ username: "Ludwig" });
  
  // extract the inferred type
  type User = z.infer<typeof User>;
 */

const AddArticleResponseSchema = z.object(
    {
        data: z.object({
            data: z.object({
                insert_article: z.object({
                    returning: z.object({
                        id: z.number(),
                        title: z.string(),
                        subtitle: z.string(),
                        content: z.string(),
                        short_content: z.string(),
                        image: z.string()
                    }).array()
                })
            })
        })
    }
)

type AddArticleResponse = z.infer<typeof AddArticleResponseSchema>

const UpdateArticleResponseSchema = z.object(
    {
        data: z.object({
            data: z.object({
                insert_article: z.object({
                    returning: z.object({
                        id: z.number(),
                        title: z.string(),
                        subtitle: z.string(),
                        content: z.string(),
                        short_content: z.string(),
                        image: z.string(),
                        updated_at: z.string(),
                    }).array()
                })
            })
        })
    }
)

type UpdateArticleResponse = z.infer<typeof UpdateArticleResponseSchema>

const DeleteArticleResponseSchema = z.object(
    {
        data: z.object({
            delete_article: z.object({
                returning: z.object({
                    id: z.number()
                }).array()
            })
        })
    }
)

type DeleteArticleResponse = z.infer<typeof DeleteArticleResponseSchema>

export const addArticle = async (title: string, subtitle: string, content: string, image: string, shortContent: string): Promise<AddArticleResponse | null> => {
    const response = await fetch("https://epic-weevil-67.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "6auz5oSy7T4sQid5CXQijrOKZP2P7yjeV1RpEyl57rxN7rMvOayrqcGNZxLML3uI"
        },
        body: JSON.stringify({
            query: `
            mutation addArticle {
                insert_article(objects: {title: ${title}, subtitle: ${subtitle} , content: ${content} , image: ${image} , short_content: ${shortContent}}) {
                  returning {
                    id
                  }
                }
              }
              `,
        }),
    })
    const payload = await response.json();
    const result = AddArticleResponseSchema.safeParse(payload)
    if (result.success === false) {
        console.log(result.error);
        return null;
    }

    return result.data;
}

// TODO: edit article

export const updateArticle = async (id: number, title: string | null, subtitle: string | null, content: string | null, image: string | null, shortContent: string | null): Promise<UpdateArticleResponse | null> => {
    const response = await fetch("https://epic-weevil-67.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "6auz5oSy7T4sQid5CXQijrOKZP2P7yjeV1RpEyl57rxN7rMvOayrqcGNZxLML3uI"
        },
        body: JSON.stringify({
            query: `
            mutation updateArticle {
                update_article(where: {id: {_eq: ${id}}}, _set: {title: ${title}, subtitle: ${subtitle}, content: ${content}, image: ${image}, short_content: ${shortContent}}}) {
                  returning {
                    id
                    title
                    subtitle
                    content
                    short_content
                    image
                    updated_at
                  }
                }
              }
              `,
        }),
    })
    const payload = await response.json();
    const result = UpdateArticleResponseSchema.safeParse(payload)
    if (result.success === false) {
        console.log(result.error);
        return null;
    }

    return result.data;
}

// TODO: delete article
export const deleteArticle = async (id: number): Promise<DeleteArticleResponse | null> => {
    const response = await fetch("https://epic-weevil-67.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "6auz5oSy7T4sQid5CXQijrOKZP2P7yjeV1RpEyl57rxN7rMvOayrqcGNZxLML3uI"
        },
        body: JSON.stringify({
            query: `
            mutation DeleteArticle{
                delete_article(where: {id: {_eq: ${id}}}) {
                    returning {
                    id
                    }
                }
                }
                `,
        }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const payload = await response.json();
    console.log(payload);
    const result = DeleteArticleResponseSchema.safeParse(payload)
    if (result.success === false) {
        console.log(result.error);
        return null;
    }

    return result.data;
}