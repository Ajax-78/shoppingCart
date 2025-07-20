import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Order {
  product: string;
  quantity: number | null;
 
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent  {

  productList: string[] = [
    "Pencil", "Eraser", "Pens", "Notebook", "Sharpener",
    "Ruler", "Highlighter", "Marker"
  ];

  quantityList: number[] = [0,1, 2, 3, 4, 5];

  rows: Order[] = [{ product: '', quantity: null }];

  finalOrder: Order[] = [];
  
  addedRowIndices: Set<number> = new Set();


  onSelectionChange(index: number) {
    const row = this.rows[index];
    const isLastRow = index === this.rows.length - 1;

   
  if (row.product !== '' && row.quantity !== null && isLastRow && this.rows.length < 8) {
  this.rows.push({ product: '', quantity: null });
}

  }

  onClickAdd(index: number) {
  const selectedRow = this.rows[index];

  if (!selectedRow.product && (selectedRow.quantity === null || selectedRow.quantity === 0)) {
    alert("Please select a product and quantity before adding.");
    return;
  }

  if (!selectedRow.product) {
    alert("Please select a product.");
    return;
  }

  if (selectedRow.quantity === null || selectedRow.quantity === 0) {
    alert("Please select a quantity greater than 0.");
    return;
  }

  const isDuplicate = this.finalOrder.some(order => order.product === selectedRow.product);
  if (isDuplicate) {
    alert("This product is already in the final order.");
    return;
  }

if (!isDuplicate && selectedRow.quantity > 0) {
     this.addedRowIndices.add(index);
    alert("Order added successfully!");  
  }


}

  showOrder() {
      const validOrders = this.rows.filter(
      row => row.product && row.quantity !== null && row.quantity > 0
    );
    
    this.finalOrder = [];
    for (const order of validOrders) {
      const alreadyAdded = this.finalOrder.some(item => item.product === order.product);
      if (!alreadyAdded) {
        this.finalOrder.push({ ...order });
      }
    }
    
  }


readFinalOrder() {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser does not support speech synthesis.");
    return;
  }

  const items = this.finalOrder.map(item =>
    `Product: ${item.product}, Quantity: ${item.quantity}.`
  );

  let index = 0;

  const speakItem = () => {
    if (index < items.length) {
      const utterance = new SpeechSynthesisUtterance(items[index]);
      window.speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        index++;
        setTimeout(speakItem, 100); 
      };
    }
  };

  speakItem();
}


}
