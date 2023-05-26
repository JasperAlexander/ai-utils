# ai-chat

A Next.js app that allows users to chat with AI using the OpenAI API. Features:

- Create and collaborate on projects.
- Chat with files added to the same folder.
- Add files to your messages.
- Receive messages in a stream.
- View messages in markdown with code syntax highlighting.
- Resend, edit, remove and copy messages.
- Categorize and save chats (to a MongoDB database).

## Getting started

### Using docker

1. Add the missing variables to the .env.example file.

2. Rename .env.example to .env.local. You can do this by running the following command in the root directory of this app.

```sh
mv .env.example .env.local
```

3. Run the following command in the root directory (ai-utils).

```sh
docker-compose up
```

4. Go to [http://localhost:3000/](http://localhost:3000/) to start chatting.

### Using manual setup

1. Install the dependencies by running the following command in the ai-utils directory.

```sh
pnpm install
```

2. Go to the ai-chat directory and add the missing variables to the .env.example file.

3. Rename .env.example to .env.local. You can do this by running the following command in the root directory of this app.

```sh
mv .env.example .env.local
```

4. Run the following command to run ai-chat.

```sh
pnpm run dev
```

5. Go to [http://localhost:3000/](http://localhost:3000/) to start chatting.

## Contributing

If you're interested in contributing, please read the [contributing docs](../../CONTRIBUTING.md) before submitting a pull request.

## License

This app is licensed under the MIT License. See [LICENSE](../../LICENSE.md) for more information.
