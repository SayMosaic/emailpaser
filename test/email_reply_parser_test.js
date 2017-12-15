'use strict'

const fs = require('fs');

const EmailReplyParser = require('../lib/emailreplyparser').EmailReplyParser;

function get_email(name) {
    const data = fs.readFileSync(__dirname + '/emails/' + name + '.txt', 'ascii');
    return EmailReplyParser.read(data);
}

function get_raw_email(name) {
    return fs.readFileSync(__dirname + '/emails/' + name + '.txt', 'ascii');
}

exports.test_reads_simple_body = function(test){
    const reply = get_email('email_with_simple_body');
    test.equal(3, reply.fragments.length);
    test.deepEqual([false, false, false], reply.fragments.map(function(f) { return f.quoted; }));
    test.deepEqual([false, true, true], reply.fragments.map(function(f) { return f.signature; }));
    test.deepEqual([false, true, true], reply.fragments.map(function(f) { return f.hidden; }));
    test.equal("Hi folks\n\nWhat is the best way to clear a Riak bucket of all key, values after\n\nrunning a test?\n\nI am currently using the Java HTTP API.\n", reply.fragments[0].to_s());
    test.equal("-Alex\n", reply.fragments[1].to_s());
    test.done();
}

exports.test_reads_contains_star_signature = function(test) {
    const reply = get_email('email_signature_contains_star');
    test.equal(3, reply.fragments.length);
    test.deepEqual([false, false, false], reply.fragments.map( function(f) { return f.quoted; }));
    test.deepEqual([false, true, true], reply.fragments.map(function(f) { return f.signature; }));
    test.deepEqual([false, true, true], reply.fragments.map(function(f) { return f.hidden; }));
    test.equal("Hello\n\nMr Rick Olson\n\nGalactic President Superstar Mc Awesomeville\n\nGitHub\n", reply.fragments[0].to_s());
    test.done()
}

exports.test_reads_lines_separate_string = function(test) {
    const reply = get_email('email_lines_separate_string');
    test.equal(2, reply.fragments.length);
    test.deepEqual([false, false], reply.fragments.map( function(f) { return f.quoted; }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.signature; }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.hidden; }));
    test.equal("Hi Tom,\n", reply.fragments[0].to_s());
    test.done()
}


exports.test_reads_lines_separate_string_and_number = function (test) {
    const reply = get_email('email_lines_separate_string_number');
    test.equal(2, reply.fragments.length);
    test.deepEqual([false, false], reply.fragments.map(function(f) { return f.quoted }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.signature }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.hidden }));
    test.equal('Hi Tom,\n\n    hello\n', reply.fragments[0].to_s());
    test.done()
}


exports.test_reads_inline_replies = function(test){
    const reply = get_email('email_reads_inline_replies');
    test.equal(9, reply.fragments.length);
    test.deepEqual([true, false, true, false, true, false, true, false, false], reply.fragments.map(function(f) { return f.quoted; }));
    test.deepEqual([false, false, false, false, false, false, true, false, true], reply.fragments.map(function(f) { return f.signature; }));
    test.deepEqual([false, false, false, false, true, true, true, true, true], reply.fragments.map(function(f) { return f.hidden; }));

    test.ok((new RegExp('^On [^\:]+\:')).test(reply.fragments[0].to_s()));
    test.ok((/^I will reply/m).test(reply.fragments[1].to_s()));
    test.ok((/^> /m).test(reply.fragments[2].to_s()));
    test.ok((/^and under this./m).test(reply.fragments[3].to_s()));
    test.ok((/^> /m).test(reply.fragments[4].to_s()));
    test.equal('', reply.fragments[5].to_s().trim());
    test.ok((new RegExp('^-')).test(reply.fragments[8].to_s()));
    test.done();
}

exports.test_reads_email_with_correct_signature = function(test){
    const reply = get_email('correct_sig');
    test.equal(2, reply.fragments.length);
    test.deepEqual([false, false], reply.fragments.map(function(f) { return f.quoted; }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.signature; }));
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.hidden; }));

    test.ok((new RegExp('^--\n\nrick')).test(reply.fragments[1].to_s()));
    test.done();
}

exports.test_deals_with_multiline_reply_headers = function(test){
    const reply = get_email('email_with_multiline_reply_headers');
    test.ok((new RegExp('^I get')).test(reply.fragments[0].to_s()));
    test.ok((/^On/m).test(reply.fragments[1].to_s()));
    test.ok((new RegExp('Was this')).test(reply.fragments[1].to_s()));
    test.done();
}

exports.test_reads_with_equal_sign = function(test) {
    const reply = get_email('email_contains_equal_sign');
    test.equal(2, reply.fragments.length);
    test.deepEqual([false, true], reply.fragments.map(function(f) { return f.signature; }));
    test.equal("HI Sam\n\nYou are beautiful\n", reply.fragments[0].to_s());
    test.done();
}
