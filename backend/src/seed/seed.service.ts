import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async runSeed() {
    const products = [
      {
        nombre: 'Café Americano',
        precio: 35,
        stock: 50,
      },
      {
        nombre: 'Capuchino',
        precio: 55,
        stock: 40,
      },
      {
        nombre: 'Croissant',
        precio: 45,
        stock: 30,
      },
    ];

    const clients = [
      {
        nombre: 'Cliente Demo 1',
        puntos_fidelidad: 10,
      },
      {
        nombre: 'Cliente Demo 2',
        puntos_fidelidad: 20,
      },
    ];

    for (const product of products) {
      const exists = await this.productRepository.findOne({
        where: {
          nombre: product.nombre,
        },
      });

      if (!exists) {
        await this.productRepository.save(
          this.productRepository.create(product),
        );
      }
    }

    for (const client of clients) {
      const exists = await this.clientRepository.findOne({
        where: {
          nombre: client.nombre,
        },
      });

      if (!exists) {
        await this.clientRepository.save(
          this.clientRepository.create(client),
        );
      }
    }

    return {
      message: 'Seed ejecutado correctamente',
    };
  }
}