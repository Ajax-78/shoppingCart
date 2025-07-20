import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';


describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent] 
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one row', () => {
    expect(component.rows.length).toBe(1);
    expect(component.rows[0]).toEqual({ product: '', quantity: null });
  });

  it('should add a new row on valid selection in last row', () => {
    component.rows[0] = { product: 'Pencil', quantity: 1 };
    component.onSelectionChange(0);
    expect(component.rows.length).toBe(2); 
  });

  it('should not add new row if max 8 rows reached', () => {
    for (let i = 0; i < 8; i++) {
      component.rows[i] = { product: 'Pencil', quantity: 1 };
    }
    component.onSelectionChange(7);
    expect(component.rows.length).toBeLessThanOrEqual(8);
  });

  it('should alert if add is clicked with empty product and quantity', () => {
    spyOn(window, 'alert');
    component.rows[0] = { product: '', quantity: null };
    component.onClickAdd(0);
    expect(window.alert).toHaveBeenCalledWith('Please select a product and quantity before adding.');
  });

  it('should alert if duplicate product is added', () => {
    spyOn(window, 'alert');
    component.finalOrder = [{ product: 'Pencil', quantity: 1 }];
    component.rows[0] = { product: 'Pencil', quantity: 1 };
    component.onClickAdd(0);
    expect(window.alert).toHaveBeenCalledWith('This product is already in the final order.');
  });

  it('should add product to addedRowIndices if valid and not duplicate', () => {
    spyOn(window, 'alert');
    component.rows[0] = { product: 'Notebook', quantity: 2 };
    component.onClickAdd(0);
    expect(component.addedRowIndices.has(0)).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith('Order added successfully!');
  });

  it('should build finalOrder on showOrder', () => {
    component.rows = [
      { product: 'Pencil', quantity: 1 },
      { product: 'Eraser', quantity: 2 },
      { product: 'Pencil', quantity: 3 } 
    ];
    component.showOrder();
    expect(component.finalOrder.length).toBe(2);
    expect(component.finalOrder).toEqual([
      { product: 'Pencil', quantity: 1 },
      { product: 'Eraser', quantity: 2 }
    ]);
  });

  it('should read out loud finalOrder using speechSynthesis', (done) => {
    const synthSpy = spyOn(window.speechSynthesis, 'speak').and.callFake((utterance: any) => {
      setTimeout(() => utterance.onend(), 10);
    });

    component.finalOrder = [
      { product: 'Pen', quantity: 2 },
      { product: 'Notebook', quantity: 1 }
    ];

    component.readFinalOrder();

    setTimeout(() => {
      expect(synthSpy).toHaveBeenCalledTimes(2);
      done();
    }, 50);
  });

});
