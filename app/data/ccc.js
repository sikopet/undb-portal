define(['text!./ccc.json'], function(rawData) {

    try
    {
        return JSON.parse(rawData);
    }
    catch(e)
    {
        console.error("Errro parsing ccc.json: "+e);

    }
});
