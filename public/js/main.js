function StartSliding() {
  const interval = 3; //seconds
  let currentSection = 0;
  const feature = document.getElementsByTagName('li');
  const slideInterval = setInterval(nextSection, interval * 1000);
  
  //Hack to start from the first and not 0 as 1 and 1+1=2 (so the second section);
  feature[currentSection].className = 'current';
  
  function nextSection() {
    feature[currentSection].className = '';
    currentSection = (currentSection+1)%feature.length;
    feature[currentSection].className = 'current';
  }
}

StartSliding();



