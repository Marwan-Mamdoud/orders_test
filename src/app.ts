import express from 'express';
import { connectDB } from './db';
import routes from './routes/order.routes';

const app = express();
app.use(express.json());
app.use('/orders', routes);

if (require.main === module) {
  connectDB()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}

export default app;
