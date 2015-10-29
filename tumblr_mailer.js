//October 28, 2015

var parse = require('./getContacts.js');
var ejs = require('ejs');
var fs = require('fs');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('3nKXv_D-FEuJs_u5oUN2Aw');


// Authenticate via OAuth
var client = tumblr.createClient({
  consumer_key: 'x',
  consumer_secret: 'x',
  token: 'x',
  token_secret: 'x'
});


//Read friendlist file and parse it into an array "friends"
var csvFile = fs.readFileSync("friend_list.csv","utf8");

var csv_data = parse.csvParse(csvFile);

//Read in email template file
var emailTemplate = fs.readFileSync('email_template.html', 'utf-8');


//Will need to know how many seconds in a week for later computation
var secsInWeek = 7*24*60*60;

//"Recent posts" will be an array that holds objects with an href and title property

var recentPosts = [];
client.posts('mellowcatcollections',function(err, blog){
	//Iterate over all blog posts	
	for (var k=0; k<blog.posts.length;k++){

		var blogject= {};
		//If blog is less than a week old...
		if (blog.posts[k].timestamp > ((Date.now()/1000) - secsInWeek)){	
			//Retrieve its title and href properties and push it to recent 
			//posts array
			blogject.title = blog.posts[k].title;
			blogject.href= blog.posts[k].post_url;
			recentPosts.push(blogject);
				
			}
		}
		//For each contact...
		csv_data.forEach(function(contactObj){
				//Create & send customized email
				var customizedEmail = ejs.render(emailTemplate, 
                { firstName: contactObj.firstName,  
                  numMonthsSinceContact: contactObj.numMonthsSinceContact,
                  latestPosts: recentPosts
                });
				console.log(customizedEmail);
				console.log("hi");
				sendEmail(contactObj.firstName, contactObj.emailAddress, "Katherine","kam422@cornell.edu","testing", customizedEmail);
	
		}
	)})

//The following function provided by FS Academy
 function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }
