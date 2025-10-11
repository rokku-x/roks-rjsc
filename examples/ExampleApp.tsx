import React, { useState } from 'react';
import { Button, Card, Input } from '../src';

const ExampleApp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Simple email validation
    if (value && !value.includes('@')) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = () => {
    alert(`Form submitted!\nName: ${name}\nEmail: ${email}`);
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>roks-rjsc Component Library Examples</h1>
      
      <Card 
        title="Contact Form"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="primary" 
              size="medium"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button 
              variant="secondary" 
              size="medium"
              onClick={() => {
                setName('');
                setEmail('');
                setEmailError('');
              }}
            >
              Clear
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={setName}
            helperText="Your full name"
          />
          
          <Input 
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            helperText={!emailError ? 'We\'ll never share your email' : undefined}
          />
        </div>
      </Card>

      <div style={{ marginTop: '32px' }}>
        <Card title="Button Variants">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '32px' }}>
        <Card title="Button Sizes">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="medium">Medium</Button>
            <Button variant="primary" size="large">Large</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExampleApp;
