/*
 * Add default skills to be displayed when no suggestions 
 * from social data is fetched. If social data(skills) is present,
 * then it would automatically be appended to this below list
 */

var defaultSkills = ['Electronics','HTML','HTML5','CSS','CSS3','PHP','JavaScript','Java',
'Ruby','Python','Management','C','C++','Matlab','Erlang','BASIC','COBOL','Advanced Java',
'Bootstrap','Angularjs','EmberJs','BackbobeJs','JQuery','ActionScript','Git','Github','Asp.Net',
'Web Development','Developer','Science','Logic','Analytical'],

    skillsName,
    autocompleteSocial = false;
