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
  
  showFinalList: boolean = false;

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

  if (selectedRow.quantity > 0) {
    this.addedRowIndices.add(index);

    // 👉 Store item in finalOrder
    this.finalOrder.push({ ...selectedRow });

    alert("Order added successfully!");
  }
}

showOrder() {
  if (this.finalOrder.length === 0) {
    alert("No items have been added yet.");
    return;
  }

  // Just trigger a flag to display finalOrder in template
  this.showFinalList = true;
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
        setTimeout(speakItem, 1000); 
      };
    }
  };

  speakItem();
}


}
