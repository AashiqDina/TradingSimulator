import React from 'react';
import "./About.css";

const About = () => {
  return (
    <>
      <section className='AboutContainer'>
        <article className='AboutTitle'>
          <h2>About</h2>
        </article>
        <article className='AboutText'>
          <p>This Stock Trading Simulator is a simplified stock portfolio management system that replicates key investment functionalities to help users experiment with investing.
            I independently designed and coded every part of this project, from the UI layout to the backend logic, as a hands-on learning exercise to strengthen my understanding of the technologies used.
            All icons, logos, and visuals were also created by me. While it may not be perfect, I genuinely enjoyed building it and experimenting with new ideas throughout the process.
          </p>
        </article>
      </section>
    </>
  );
};

export default About;
