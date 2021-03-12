import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";

import { Store } from "@ngrx/store";

import { Observable } from "rxjs/Observable";
import { tap, map, filter, take, switchMap } from "rxjs/operators";
import { Pizza } from "../models/pizza.model";

import * as fromStore from "../store";

@Injectable()
export class PizzaExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ProductsState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.pizzaId;
        return this.hasPizza(id);
      })
    );
  }

  hasPizza(id: number): Observable<boolean> {
    return this.store.select(fromStore.getPizzasEntities).pipe(
      map((entities: { [key: number]: Pizza }) => !!entities[id]),
      take(1)
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getAllPizzasLoaded).pipe(
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadPizzas());
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
