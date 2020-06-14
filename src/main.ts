const greeter = (person: string) => `Hello, ${person}`;

function testGreeter() {
    const user = "Kaho";
    Logger.log(greeter(user));

    const age = 12;
    Logger.log(greeter(age));
}
