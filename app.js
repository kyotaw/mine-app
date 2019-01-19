require('./src/entry').start().catch(err => {
    console.error('Kairai server failed starting');
    console.error(err);
});
