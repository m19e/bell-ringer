const greeter = (person: string) => {
    return `Hello, ${person}`;
};

function testGreeter() {
    const user = "Kaho";
    Logger.log(greeter(user));

    const age = 30;
    Logger.log(greeter(age));
}
