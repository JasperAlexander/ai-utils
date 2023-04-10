# ai-chat

An app that allows users to chat with AI using the OpenAI API. Features:

- Add files to your messages. The plain text is extracted and added to the prompt following the OpenAI best practises on seperating instruction and context.
- Receive messages in a stream.
- View messages in markdown with code syntax highlighting.
- Copy the plain text of each message.

## Installation

Install the dependencies by running one of the following commands, depending on your package manager.

```sh
pnpm install
```

## Usage

1. Add an OpenAI API key to the .env.example file.

2. Rename .env.example to .env.local. You can do this by running the following command in the root directory of this app.

```sh
mv .env.example .env.local
```

3. Run one of the following commands depending on your package manager to run this app.

```sh
pnpm run dev
```

4. Go to [http://localhost:3000/](http://localhost:3000/) to start chatting.

## Contributing

If you're interested in contributing, please read the [contributing docs](../../CONTRIBUTING.md) before submitting a pull request.

## License

This app is licensed under the MIT License. See [LICENSE](../../LICENSE.md) for more information.
