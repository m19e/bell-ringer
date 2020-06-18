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
        values.push(createValue(messages[0], words));
    }

    PropertiesService.getScriptProperties().setProperty(
        "LAST_ROW_NUMBER",
        `${values.length + 1}`
    );

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
                        startColumnIndex: 3,
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

const createValue = (
    message: GoogleAppsScript.Gmail.GmailMessage,
    words: Array<string>
): Array<string> => {
    return [
        message.getId(),
        Utilities.formatDate(message.getDate(), "JST", "yyyy-MM-dd HH:mm:ss"),
        message.getSubject(),
        message.getAttachments().length != 0 ? "TRUE" : "FALSE",
        checkWordsInBody(message.getPlainBody(), words),
        `https://mail.google.com/mail/u/0/#all/${message.getId()}`,
    ];
};

const checkWordsInBody = (body: string, words: string[]): string => {
    for (const word of words) {
        if (body.includes(word)) {
            return "TRUE";
        }
    }
    return "FALSE";
};

// for test
const decLastRowNum = () => {
    const props = PropertiesService.getScriptProperties();
    PropertiesService.getScriptProperties().setProperty(
        "LAST_ROW_NUMBER",
        `${+props.getProperty("LAST_ROW_NUMBER") - 1}`
    );
};
