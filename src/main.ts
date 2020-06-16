import "google-apps-script";

const main = () => {
    const props = PropertiesService.getScriptProperties().getProperties();
    const query: string = `from:${props["TARGET_MAIL_ADDRESS"]}`;
    const ssid: string = props["TARGET_SS_ID"];
    const words: string[] = props["TARGET_SEARCH_WORDS"].split(",");
    const threads = GmailApp.search(query, 0, 500);
    const messagesForThreads = GmailApp.getMessagesForThreads(threads);

    const values: string[][] = [];
    for (const messages of messagesForThreads) {
        const message = messages[0];
        const time = message.getDate();
        const record = [
            message.getId(),
            Utilities.formatDate(time, "JST", "yyyy-MM-dd HH:mm:ss"),
            message.getSubject(),
            // message.getPlainBody(),
            "TEXT",
            checkWordInBody(message.getPlainBody(), words),
        ];
        values.push(record);
    }

    const asc = values.slice().reverse();

    const sheet = SpreadsheetApp.openById(ssid).getSheetByName("s1");

    const [startRow, startCol, numRow, numCol] = [
        2,
        1,
        values.length,
        values[0].length,
    ];
    sheet.getRange(startRow, startCol, numRow, numCol).setValues(asc);

    const resource = {
        requests: [
            {
                repeatCell: {
                    cell: {
                        dataValidation: { condition: { type: "BOOLEAN" } },
                    },
                    range: {
                        sheetId: sheet.getSheetId(),
                        startRowIndex: 1,
                        endRowIndex: numRow + 1,
                        startColumnIndex: 4,
                        endColumnIndex: 5,
                    },
                    fields: "dataValidation",
                },
            },
        ],
    };
    Sheets.Spreadsheets.batchUpdate(
        resource,
        SpreadsheetApp.openById(ssid).getId()
    );
};

const checkWordsInBody = (body: string, words: string[]): string => {
    for (const word of words) {
        if (body.includes(word)) {
            return "TRUE";
        }
    }
    return "FALSE";
};
