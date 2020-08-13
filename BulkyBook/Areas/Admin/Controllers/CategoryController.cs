using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BulkyBook.DataAccess.Repository.IRepository;
using BulkyBook.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BulkyBook.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoryController : Controller
    {
        private readonly IUnitOfWork _uow;

        public CategoryController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upsert(int? id)
        {
            Category category = new Category();

            if(id == null)
            {
                return View(category);
            }

            category = _uow.Category.Get(id.GetValueOrDefault());

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert(Category category)
        {
            if (ModelState.IsValid)
            {
                if (category.Id == 0)
                {
                    _uow.Category.Add(category);
                }
                else
                {
                    _uow.Category.Update(category);
                }
                _uow.Save();

                return RedirectToAction(nameof(Index));
            }

            return View(category);
        }

        #region API Calls
        [HttpGet]
        public IActionResult GetAll()
        {
            var allObj = _uow.Category.GetAll();
            return Json(new { data = allObj });
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var objFromDb = _uow.Category.Get(id);

            if (objFromDb == null)
            {
                return Json(new { success = false, message = "No category with inputted ID exists" });
            }

            _uow.Category.Remove(objFromDb);
            _uow.Save();

            return Json(new { success = true, message = "Deletion successful" });
        }
        #endregion
    }
}
