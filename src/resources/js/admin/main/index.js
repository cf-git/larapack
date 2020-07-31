export default ({tools, global, $}) => {
    const $document = $(document);
    $.fn.extend();

    $document.rOn('behavior.app', () => {

    });

    $document.ready(() => {
        $document.trigger('behavior')
    });
    console.log("== Init complete!");
};
