<script lang="ts">
  import { addArticle, getDataGraph, deleteArticle } from "./lib/getdata";
  import { getArticlesWithComments } from "./lib/getdata";
  import EditDialog from "./lib/EditDialog.svelte";

  type Journalist = {
    id: number;
    name: string;
    password: string;
  };

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

  let name = "";
  let journalists: Journalist[] = [];

  let articles: Article[] = [];

  let title = "";
  let subtitle = "";
  let content = "";
  let image = "";
  let shortContent = "";

  let articleToEdit: Article | null = null;

  function openEditDialog(article: Article) {
    console.log(article);
    articleToEdit = article;
  }

  const load = async () => {
    const data = await getDataGraph(name);
    journalists = data;
  };

  const showArticles = async () => {
    const data = await getArticlesWithComments();
    articles = data;
  };

  const submitArticle = async () => {
    const result = await addArticle(
      title,
      subtitle,
      content,
      image,
      shortContent
    );

    if (!result) {
      alert("sg happened");
      return;
    }

    console.log(result);
    alert("created articles" + result.data.data.insert_article.returning[0].id);
    showArticles();
  };

  const delArticle = async (id: number) => {
    const result = await deleteArticle(id);
    if (!result) {
      alert("sg happened");
      return;
    }

    console.log(result);

    alert("deleted article: " + result.data.delete_article.returning[0].id);
    showArticles();
  };
</script>

<main>
  <div class="forms">
    <section class="custom-form">
      <h3>Find user by name</h3>
      <input bind:value={name} />
      <button on:click={load}> Load </button>
      {#each journalists as journalist}
        <p>{journalist.name}</p>
      {/each}
    </section>
    <section>
      <h3>Add new article</h3>
      <div class="custom-form">
        <div class="labelled-input">
          <label for="title">Title</label>
          <input id="title" bind:value={title} />
        </div>
        <div class="labelled-input">
          <label for="subtitle">Subtitle</label>
          <input id="subtitle" bind:value={subtitle} />
        </div>
        <div class="labelled-input">
          <label for="content">Content</label>
          <input id="content" bind:value={content} />
        </div>
        <div class="labelled-input">
          <label for="image">Image</label>
          <input id="image" bind:value={image} />
        </div>
        <div class="labelled-input">
          <label for="short-content">Short content</label>
          <input id="short-content" bind:value={shortContent} />
        </div>
      </div>
      <div class="action-btns">
        <button on:click={submitArticle}>Add article</button>
      </div>
    </section>
  </div>
  <button on:click={showArticles}> Show articles </button>
  <section class="article-list">
    {#each articles as article}
      <article class="article">
        <div class="heading">
          <img src={article.image} class="article-main-pic" alt="" />
          <h2 class="article-title">{article.title}</h2>
          <h3 class="article-title">{article.subtitle}</h3>
        </div>
        {#each article.journalists as journalist}
          <h6>{journalist.journalist.name}</h6>
        {/each}
        <p>
          {article.content}
        </p>
        <p>
          {article.created_at}
        </p>
        {#each article.comments as comment}
          <p>{comment.content}</p>
          <p>{comment.user.username}</p>
        {/each}
        <div class="action-btns">
          <button on:click={() => openEditDialog(article)}>Edit</button>
          <button on:click={() => delArticle(article.id)}>Delete</button>
        </div>
      </article>
    {/each}
  </section>

  {#if articleToEdit !== null}
    <EditDialog
      article={articleToEdit}
      on:close={() => (articleToEdit = null)}
    />
  {/if}
</main>

<style>
  main {
    width: 100%;
  }

  .forms {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 0 auto;
  }

  .labelled-input {
    display: flex;
    align-items: center;
  }

  .labelled-input label,
  .labelled-input input {
    width: 50%;
  }

  .labelled-input label {
    text-align: left;
  }

  button {
    margin: 10px;
  }

  .custom-form {
    display: flex;
    flex-direction: column;
  }

  .custom-form input {
    margin: 5px;
    padding: 5px;
  }

  .article-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
  }

  .article {
    border: 2px solid lightgray;
    border-radius: 10px;
    flex-basis: 45%;
    padding: 0 5px 5px;
  }

  .article-title {
    position: relative;
    margin: 0 5px;
    text-align: left;
  }
  /* 
  .article .heading {
    position: relative;
    width: 100%;
    height: 30%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-wrap: nowrap;
  }

  .article .heading .article-main-pic {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  } */

  .article-main-pic {
    width: 100px;
  }

  .action-btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
