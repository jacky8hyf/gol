$(function() {
    // parse params
    var params = new URLSearchParams(window.location.search);
    var width = parseInt(params.get("width")) || 10;
    var height = parseInt(params.get("height")) || 10;
    var wrap = ["true","1"].includes(params.get("wrap"));

});