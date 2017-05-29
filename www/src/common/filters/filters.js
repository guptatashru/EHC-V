app.filter('startsWithLetter', function () {
    return function (items, letter) {
        var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        try {
            //console.log("Entering")
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (letterMatch.test(item.substring(0, letter.length))) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
        catch(e){
            return items;
        }
    };
});