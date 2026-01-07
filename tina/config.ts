import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blogs",
        path: "src/content/blogs",
        fields: [
          {
            type: "string",
            name: "title",
            label: "タイトル",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            name: "thumbnail",
            label: "サムネイル",
          },
          {
            type: "string",
            name: "description",
            label: "説明",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "tags",
            label: "タグ",
            list: true,
            fields: [
              {
                type: "reference",
                name: "tag",
                label: "タグ",
                collections: ["tag"],
              },
            ],
            ui: {
              itemProps: (item: { tag?: string }) => {
                const tagPath = item?.tag;
                if (tagPath) {
                  const tagName = tagPath.split("/").pop()?.replace(".md", "");
                  return { label: tagName };
                }
                return { label: "タグを選択" };
              },
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "tag",
        label: "Tags",
        path: "src/content/tags",
        fields: [
          {
            type: "string",
            name: "name",
            label: "タグ名",
            isTitle: true,
            required: true,
          },
        ],
      },
    ],
  },
});
