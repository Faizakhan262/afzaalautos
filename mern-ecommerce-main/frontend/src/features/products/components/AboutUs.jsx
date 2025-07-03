import React from 'react';
import bike2parts from "../../../assets/images/bike2parts.jpg"; 

export const AboutUs = () => {
  return (
    <section
      className="about-section"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap:"10px",
      }}
    >
      <div style={{ flex: 1, textAlign: 'center',  backgroundColor: '#D4AF37',
        padding: '2rem',
        marginTop: '40px',
        color: 'white',
        letterSpacing: '1px',
        fontWeight:'500' }}>
        <p>
          Welcome to our site! We're passionate about creating amazing digital experiences and helping businesses grow through technology.
        </p>
        <p>
          Our team is made up of designers, developers, and strategists who love what they do and are always pushing boundaries.
        </p>
        <p>
          Since our founding, we've worked with clients across a wide range of industries—from startups to established enterprises—delivering innovative solutions that drive real results.
        </p>
        <p>
          We believe in the power of collaboration, creativity, and code. Every project we take on is an opportunity to challenge the status quo and build something truly unique.
        </p>
       
        
      </div>
      <div style={{ flex: 1,display: 'flex', justifyContent: 'center', backgroundColor: 'white',marginTop: '40px', height:"340px"}}>
        <img
          src={bike2parts}
          alt="About us"
          style={{ maxHeight: '100%', borderRadius: '8px' ,width:"400px"}}
        />
      </div>
    </section>
  );
};
