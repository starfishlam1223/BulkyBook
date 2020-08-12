﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BulkyBook.Models.ViewModels
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name="category Name")]
        [MaxLength(50)]
        public string Name { get; set; }
    }
}