# ai-utils

This repository (which uses [Turborepo](https://turbo.build/)) contains the following packages:

- [file-to-text](packages/file-to-text/README.md): Convert files to plain text.
- [text-to-aitext](packages/text-to-aitext/README.md): Convert text to AI-generated text.
- [text-to-chunks](packages/text-to-chunks/README.md): Split text into multiple chunks.
- [text-to-embeddings](packages/text-to-embeddings/README.md): Convert text to vector embeddings.

Additionally, it contains the following applications:

- [ai-chat](apps/ai-chat/README.md): A Next.js 13 application that allows users to chat with AI using the OpenAI API.
- [file-converter](apps/file-converter/README.md): A Next.js 13 application that converts files to text that can also be shown in markdown styling.

## Usage

1. Clone this repository:

```sh
git clone https://github.com/JasperAlexander/ai-utils.git
```

2. Inside the repository, run the following command to install the dependencies:

```sh
pnpm install
```

3. Add an OpenAI API key to apps/ai-chat/.env.example.

4. Rename .env.example to .env.local. You can do this by running the following command in the root directory of this app.

```sh
mv apps/ai-chat/.env.example apps/ai-chat/.env.local
```

5. Build all apps and packages by running the following command:

```sh
pnpm run build
```

6. To start all apps and packages locally, run the following command:

```sh
pnpm run dev
```

## Contributing

If you're interested in contributing, please read the [contributing docs](https://github.com/JasperAlexander/ai-utils/blob/main/CONTRIBUTING.md) before submitting a pull request.

## License

This repository is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.
