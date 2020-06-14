import "google-apps-script";

const greeter = (person: string) => `Hello, ${person}`;

function testGreeter() {
    const user = "Kaho";
    Logger.log(greeter(user));

    const age = 12;
    Logger.log(greeter(age));
}

const main = () => {
    const address = PropertiesService.getScriptProperties().getProperty(
        "TARGET_MAIL_ADDRESS"
    );
    const query = `from:${address}`;
    const threads = GmailApp.search(query, 0, 10);
    const messagesForThreads = GmailApp.getMessagesForThreads(threads);

    const values = [];
    for (const messages of messagesForThreads) {
        const message = messages[0];
        const record = [
            message.getDate(),
            message.getFrom(),
            message.getSubject(),
            message.getPlainBody().slice(0, 200),
        ];
        values.push(record);
    }

    for (const value of values) {
        Logger.log(value);
    }
};
