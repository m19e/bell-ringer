import "google-apps-script";

const main = () => {
    const address = PropertiesService.getScriptProperties().getProperty(
        "TARGET_MAIL_ADDRESS"
    );
    const query = `from:${address}`;
    const threads = GmailApp.search(query, 0, 500);
    const messagesForThreads = GmailApp.getMessagesForThreads(threads);

    const values = [];
    for (const messages of messagesForThreads) {
        const message = messages[0];
        const record = [
            message.getId(),
            message.getDate(),
            message.getSubject(),
            message.getPlainBody(),
        ];
        values.push(record);
    }

    for (const value of values) {
        Logger.log(value);
    }
};
