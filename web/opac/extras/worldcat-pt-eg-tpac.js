/* Pass-through links for searching Worldcat from Evergreen OPAC.

Mostly stolen from pt-worldcat by Jonathan Scott
https://github.com/jonscott/pt-worldcat
*/

// ---------- to do
// -review the original worldcat-pt script for other functionality
// -series title
// -get queries for advanced search page
// -limits:
// --date
// --language
// --format
// -read advanced limits from URL if not on advanced screen

// ---------- custom settings
// this could be set to www.worldcat.org, or any WorldCat Local instance
var WCbaseURL = "http://summit.worldcat.org/search?q=" 
// set this to 0 to search "Libraries worldwide"
var WCscope="&scope=1";  
// default text to use for link to worldcat
var WClinkText="Search the Summit Catalog";
// optional default code to add before and after link
var WClinkPrefix="" ;
var WClinkSuffix="" ;
// 1 to open pt search in new window
var WCnewWindow = 1;

// ---------- variables to initialize
var here = location.href;
var WCquery='';
var WCurl='';

// ---------- normalize titles for searching WorldCat

function replaceGlobal (string,fromstr,tostr) {
	var replaceRE = new RegExp(fromstr, "g") ;
	return string.replace( replaceRE , tostr) ;
}

function WCnormalize(title) {     
	title = title.replace("[electronic resource]", "");  //---Remove [electronic resource], (WSU Cataloging) WC chokes --
	title = title.replace("[video recording]", "");  
	title = title.replace("[videorecording]", ""); 
	title = title.replace("[microform]", "");  
	title = title.replace("[", "");  //---Remove all bracketed data 
	title = title.replace("]", "");  
	title = replaceGlobal(title,unescape('%C0'),'A');
	title = replaceGlobal(title,unescape('%C1'),'A');
	title = replaceGlobal(title,unescape('%C2'),'A');
	title = replaceGlobal(title,unescape('%C3'),'A');
	title = replaceGlobal(title,unescape('%C4'),'A');
	title = replaceGlobal(title,unescape('%C5'),'A');
	title = replaceGlobal(title,unescape('%C6'),'AE');
	title = replaceGlobal(title,unescape('%C7'),'C');
	title = replaceGlobal(title,unescape('%C8'),'E');
	title = replaceGlobal(title,unescape('%C9'),'E');
	title = replaceGlobal(title,unescape('%CA'),'E');
	title = replaceGlobal(title,unescape('%CB'),'E');
	title = replaceGlobal(title,unescape('%CC'),'I');
	title = replaceGlobal(title,unescape('%CD'),'I');
	title = replaceGlobal(title,unescape('%CE'),'I');
	title = replaceGlobal(title,unescape('%CF'),'I');
	title = replaceGlobal(title,unescape('%D0'),'D');
	title = replaceGlobal(title,unescape('%D1'),'N');
	title = replaceGlobal(title,unescape('%D2'),'O');
	title = replaceGlobal(title,unescape('%D3'),'O');
	title = replaceGlobal(title,unescape('%D4'),'O');
	title = replaceGlobal(title,unescape('%D5'),'O');
	title = replaceGlobal(title,unescape('%D6'),'O');
	title = replaceGlobal(title,unescape('%D7'),'O');
	title = replaceGlobal(title,unescape('%D8'),'O');
	title = replaceGlobal(title,unescape('%D9'),'U');
	title = replaceGlobal(title,unescape('%DA'),'U');
	title = replaceGlobal(title,unescape('%DB'),'U');
	title = replaceGlobal(title,unescape('%DC'),'U');
	title = replaceGlobal(title,unescape('%DD'),'Y');
	title = replaceGlobal(title,unescape('%DE'),'P');
	title = replaceGlobal(title,unescape('%DF'),'B');
	title = replaceGlobal(title,unescape('%E0'),'a');
	title = replaceGlobal(title,unescape('%E1'),'a');
	title = replaceGlobal(title,unescape('%E2'),'a');
	title = replaceGlobal(title,unescape('%E3'),'a');
	title = replaceGlobal(title,unescape('%E4'),'a');
	title = replaceGlobal(title,unescape('%E5'),'a');
	title = replaceGlobal(title,unescape('%E6'),'ae');
	title = replaceGlobal(title,unescape('%E7'),'c');
	title = replaceGlobal(title,unescape('%E8'),'e');
	title = replaceGlobal(title,unescape('%E9'),'e');
	title = replaceGlobal(title,unescape('%EA'),'e');
	title = replaceGlobal(title,unescape('%EB'),'e');
	title = replaceGlobal(title,unescape('%EC'),'i');
	title = replaceGlobal(title,unescape('%ED'),'i');
	title = replaceGlobal(title,unescape('%EE'),'i');
	title = replaceGlobal(title,unescape('%EF'),'i');
	title = replaceGlobal(title,unescape('%F0'),'&');
	title = replaceGlobal(title,unescape('%F1'),'n');
	title = replaceGlobal(title,unescape('%F2'),'o');
	title = replaceGlobal(title,unescape('%F3'),'o');
	title = replaceGlobal(title,unescape('%F4'),'o');
	title = replaceGlobal(title,unescape('%F5'),'o');
	title = replaceGlobal(title,unescape('%F6'),'o');
	title = replaceGlobal(title,unescape('%F7'),'o');
	title = replaceGlobal(title,unescape('%F8'),'o');
	title = replaceGlobal(title,unescape('%F9'),'u');
	title = replaceGlobal(title,unescape('%FA'),'u');
	title = replaceGlobal(title,unescape('%FB'),'u');
	title = replaceGlobal(title,unescape('%FC'),'u');
	title = replaceGlobal(title,unescape('%FD'),'y');
	title = replaceGlobal(title,unescape('%FE'),'p');
	title = replaceGlobal(title,unescape('%FF'),'y');
	title = replaceGlobal(title,unescape('&amp;'),'and');

	if (title.length > 252) {  		 //--- Title is longer than WC will accept ---
		title = (title.substr(0,252));  	 //---Truncate for WC Limit --
		var wsloc = (title.lastIndexOf(" ")); //---Find Last White Space as WC chokes on incomplete words --
		title = (title.substr(0,wsloc));  	 //---Truncate at last white space --
	}

	return title ;
}

// ---------- generate the link text/button

function WCPTLink(t,p,s) {
	document.write ((p ? p : WClinkPrefix) +
                        "<a href='javascript:WCPTSearch();'>" +
                        (t ? t : WClinkText) + 
                        "</a>" + 
                        (s ? s:  WClinkSuffix)) ;
}

// ---------- hack up simple EG queries for WC
function WCtransmogrify(q) {
	q = q.replace(/ and /ig,"\) ");  // --- boolean and
	q = q.replace(/ or /ig,"\) OR ");  // --- boolean or
	q = q.replace(/author: */g,"au:");  // --- author 
	q = q.replace(/subject: */g,"su:");  // --- subject
	q = q.replace(/title: */g,"ti:");  // --- title
	q = q.replace(/keyword: */g,"kw:");  // --- keyword
	
	if (q.indexOf(":") < 0) {
		switch (document.getElementById("qtype").value)
		{
		case "title":
			q = "ti:" + q;
			break;
		case "author":
			q = "au:" + q;
			break;
		case "subject":
			q = "su:" + q;
			break;
		}
	}
	
	return (q);
}

// ---------- figure out the query and go!

function WCPTSearch () {
	// what kind of page are we on?

	if (here.indexOf("xml/rdetail.xml") > -1) {
		// item detail page
		// Not implemented for tpac. The search form is at the top of item pages, 
		// so still use the form, not the item itself.
		var title = " " + document.getElementById("rdetail_title").innerHTML ;
		WCquery = "ti:" + WCnormalize(title);

	} else if (here.indexOf("xml/advanced.xml") > -1) {
		// advanced search page
		// Not implemented yet for Evergreen.
		WCquery = "" ;
	} else {
		// search results or logon page
		WCquery = WCtransmogrify( document.getElementById("search_box").value ) ;
	}
	
	WCurl = WCbaseURL + replaceGlobal(WCquery," ","%20") + WCscope ;
	if (WCnewWindow == 1) {
		window.open (WCurl, "Summit") ;
	} else {
		location.href = WCurl ;
	}	
}
