// Save this as test-fluvio.js

// Test different import methods
async function testFluvio() {
    console.log('Testing Fluvio imports...');
    
    try {
      // Method 1: Dynamic import
      console.log('\nTrying dynamic import:');
      const dynamicModule = await import('@fluvio/client');
      console.log('Dynamic import result:', Object.keys(dynamicModule));
      console.log('Default export type:', typeof dynamicModule.default);
      
      // Method 2: Check if module has createFluvioClient function
      if (typeof dynamicModule.createFluvioClient === 'function') {
        console.log('\nFound createFluvioClient function!');
        const fluvio = dynamicModule.createFluvioClient();
        console.log('Created Fluvio client:', typeof fluvio);
      }
      
      // Method 3: Check if the default export can be used directly
      if (typeof dynamicModule.default === 'function') {
        console.log('\nTrying to use default export as constructor:');
        const FluvioClass = dynamicModule.default;
        const fluvioInstance = new FluvioClass();
        console.log('Created Fluvio instance:', typeof fluvioInstance);
      }
      
      // Method 4: Check all exported properties
      console.log('\nAll exported properties from @fluvio/client:');
      for (const key in dynamicModule) {
        console.log(`- ${key}: ${typeof dynamicModule[key]}`);
      }
      
    } catch (error) {
      console.error('Error testing Fluvio:', error);
    }
  }
  
  testFluvio();