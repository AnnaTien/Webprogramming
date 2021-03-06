import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { HttpClient } from '@angular/common/http';
const createFormGroup = dataItem => new FormGroup({
  "company_id": new FormControl(dataItem.company_id),
  "company_name": new FormControl(dataItem.company_name, Validators.required),
});

@Component({
  selector: 'app-admin-suppliers',
  templateUrl: './Suppliers.component.html',
  styleUrls: ['./Suppliers.component.scss'],

})
export class SuppliersComponent implements OnInit {
  constructor(private http: HttpClient) { }
  listcompany: any = null;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  ngOnInit() {
    this.http.get("http://127.0.0.1:3000/api/companyall").subscribe(data => {
      this.listcompany = data;
      console.log("listcompany", this.listcompany);
    });
  }
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public onStateChange(state: State) {
    this.gridState = state;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      "company_id": new FormControl(),
      "company_name": new FormControl('', Validators.required),
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.formGroup = createFormGroup(dataItem);

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  } public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;

    if (isNew) {
      this.http.post("http://127.0.0.1:3000/api/addcompany", product).subscribe(data => {
        console.log('addcompany', data);
        this.http.get("http://127.0.0.1:3000/api/companyall").subscribe(data => {
          this.listcompany = data;
          console.log("companyall", this.listcompany);
        });
      })
    }
    else {
      this.http.put("http://127.0.0.1:3000/api/updatecompany/" + product.company_id, product).subscribe(data => {

        console.log('updatecompany', data);
        this.http.get("http://127.0.0.1:3000/api/companyall").subscribe(data => {
          this.listcompany = data;
          console.log("companyall", this.listcompany);
        });
      })
    }

    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }): void {
    console.log("aaa")
    this.http.delete("http://127.0.0.1:3000/api/deletecompany/" + dataItem.company_id).subscribe(data => {
      console.log("data", data);
      this.http.get("http://127.0.0.1:3000/api/companyall").subscribe(data => {
        this.listcompany = data;
        console.log("companyall", this.listcompany);
      });
    })
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
