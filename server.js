const express = require('express');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');


const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/component/:name',(req,res)=>{
    const componentName = req.params.name;
    const componentPath = path.join(__dirname, 'components', `${componentName}.jsx`);
    if (fs.existsSync(componentPath)) {
        const componentCode = fs.readFileSync(componentPath, 'utf8');
        const transformedCode = babel.transformSync(componentCode, {
          presets: ['@babel/preset-react'],
        }).code;
        res.send(transformedCode);
    }else{
        res.status(404).send('Component not found');
    }
});


app.get('/components', (req, res) => {
    const componentsDir = path.join(__dirname, 'components');
    fs.readdir(componentsDir, (err, files) => {
      if (err) {
        res.status(500).send('Unable to scan components directory');
        return;
      }
      const components = files.filter(file => file.endsWith('.jsx')).map(file => file.replace('.jsx', ''));
      res.json(components);
    });
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });