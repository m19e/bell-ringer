import "google-apps-script";

const main = () => {
    const props = PropertiesService.getScriptProperties().getProperties();
    const query = `from:${props["TARGET_MAIL_ADDRESS"]}`;
    const ssid = props["TARGET_SS_ID"];
    const threads = GmailApp.search(query, 0, 500);
    const messagesForThreads = GmailApp.getMessagesForThreads(threads);

    const values = [];
    for (const messages of messagesForThreads) {
        const message = messages[0];
        const time = message.getDate();
        const record = [
            message.getId(),
            Utilities.formatDate(time, "JST", "yyyy-MM-dd HH:mm:ss"),
            message.getSubject(),
            // message.getPlainBody(),
            "TEXT",
        ];
        values.push(record);
    }

    const sheet = SpreadsheetApp.openById(ssid).getSheetByName("s1");

    const [startRow, startCol, numRow, numCol] = [
        2,
        1,
        values.length,
        values[0].length,
    ];
    sheet.getRange(startRow, startCol, numRow, numCol).setValues(values);
};
