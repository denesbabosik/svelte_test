<script lang="ts">
    import { updateArticle } from "./getdata";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    type Article = {
        id: number;
        image: string;
        content: string;
        short_content: string;
        title: string;
        subtitle: string;
        created_at: string;
        updated_at: string;
        journalists: [
            {
                journalist: {
                    name: string;
                };
            }
        ];
        comments: [
            {
                content: string;
                likes: number;
                user: {
                    username: string;
                };
            }
        ];
    };

    export let isOpen = false;
    export let article: Article;

    function saveChanges(
        id: number,
        title: string,
        subtitle: string,
        content: string,
        image: string,
        shortContent: string
    ) {
        const updatedArticle = {
            id: id,
            title: !article.title ? null : title,
            subtitle: !article.subtitle ? null : subtitle,
            content: !article.content ? null : content,
            image: !article.image ? null : image,
            short_content: !article.short_content ? null : shortContent,
        };
        updateArticle(
            updatedArticle.id,
            updatedArticle.title,
            updatedArticle.subtitle,
            updatedArticle.content,
            updatedArticle.image,
            updatedArticle.short_content
        );
        dispatch("close");
    }
</script>

{#if isOpen}
    <div class="overlay">
        <div class="dialog">
            <h2>Edit Article</h2>
            <div class="labelled-input">
                <label for="title">Title</label>
                <input type="text" id="title" bind:value={article.title} />
            </div>

            <div class="labelled-input">
                <label for="subtitle">Subtitle</label>
                <input
                    type="text"
                    id="subtitle"
                    bind:value={article.subtitle}
                />
            </div>

            <div class="labelled-input">
                <label for="content">Content</label>
                <textarea id="content" bind:value={article.content} />
            </div>

            <div class="labelled-input">
                <label for="image">Image URL</label>
                <input type="text" id="image" bind:value={article.image} />
            </div>

            <div class="labelled-input">
                <label for="shortcontent">Short Content</label>
                <textarea
                    id="shortcontent"
                    bind:value={article.short_content}
                />
            </div>

            <div class="button-container">
                <button
                    on:click={() => {
                        saveChanges(
                            article.id,
                            article.title,
                            article.subtitle,
                            article.content,
                            article.image,
                            article.short_content
                        );
                    }}>Save</button
                >
                <button
                    on:click={() => {
                        dispatch("close");
                    }}>Cancel</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        width: 300px;
    }

    .labelled-input {
        display: flex;
        align-items: center;
    }

    .labelled-input label,
    .labelled-input input,
    .labelled-input textarea {
        width: 50%;
    }

    .labelled-input label {
        text-align: left;
    }

    .button-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
</style>
