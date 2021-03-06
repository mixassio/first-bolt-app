главное понятие слака - workspace создается на компанию или команду. Я создал тестовое пространство - my-slack-example.slack.com

в слаке есть понятие - приложение, их может быть много. Оно и есть все наши боты, команды и прочее. Я создал тестовое приложение, оно выдаёт следующие ключи для доступа извне:
App ID
Client ID
Client Secret
Signing Secret
Verification Token (deprecated)
OAuth Access Token
Bot User OAuth Access Token

каждое приложение требует настроек доступа, например:

channels:manage
Manage public channels that test-app has been added to and create new ones

chat:write
Send messages as @testapp

commands
Add shortcuts and/or slash commands that people can use

incoming-webhook
Post messages to specific channels in Slack

## в приложении можно настроить следующие штуки:

### Incoming Webhooks

мощная штука по отправке сообщений в каналы, открывает адрес, на который можно слать сконструированные сообщения.

```
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
```

можно сделать много разных эндпоинтов, сообщения в каналы будут приходить от бота.

### Slash Commands

команды на которые реагирует бот, очень много реакций есть из коробки, язык - js, полно примеров
есть интерактивные экшены, например по команде срабатывает код и выходят кнопки, а в кнопке экшены на действия любые

### Interactivity & Shortcuts

много компонентов, например менюшки, формы. Например для создания заказа, или например выбора сборки на темсити и деплоя.

### Event Subscriptions

подписка бота на различные события: сообщения, новый пользователь в канале, пользователь зашел/вышел и т.п.
позволяет перехватывать и обрабатывать эти события.
Настраивается так - в слаке нужно зарегистрировать адрес сервера (нашего приложения) куда отсылать хуки.

Приложение в слаке - точка интеграции из которой выходит вся автоматизация, варианты взаимодействия с приложением извне:

1. Используя АПИ с ключами бота, все действия будут от бота
2. Через Incoming Webhooks - зарегистрировать в боте адреса и слать на них хуки
3. Используя официальный клиент [bolt](https://slack.dev/bolt/conceptsх)

## Bolt

для коннекта нужно

```
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
```

стартует сервер, который может перехватывать и обрабатывать все события

Особенности процесса разработки:
так как сервер слака в интернете и мы его не стартуем, а разработка ведется на локалхосте, нужно прописать в слаке внешний адрес, для этого можно использовать ngrok, который создает внешний адрес, мы его прописываем в слаке и слак отсылает хуки на адрес ngrok, который в свою очередь проксирует все запросы на локалхост

как я вижу адаптацию нашего бота к слаку:

1. прямой поток из жиры - через Incoming Webhooks, можем адаптировать наш класс слака под рест апи слака или с помощью Bolt
2. команды - описать команды в слаке и и перенаправлять хуки из слака на приложение Bolt с помощью Event Subscriptions, навесить на них всяких модных примочек
