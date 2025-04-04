import { OrderStatus } from "@sbmytickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";

interface OrderAttrs{
   id: string;
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}

interface OrderDoc extends mongoose.Document{
   version: number;
   userId: string;
   price: number;
   status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
   build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true
   },
   status:{
      type: String,
      required: true
   }
},{
   toJSON:{
      transform(doc, ret){
         ret.id = ret._id;
         delete ret._id;
      }
   }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (atters: OrderAttrs) => {
   return new Order({
      _id: atters.id,
      version: atters.version,
      price: atters.price,
      userId: atters.userId,
      status: atters.status

   });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };


