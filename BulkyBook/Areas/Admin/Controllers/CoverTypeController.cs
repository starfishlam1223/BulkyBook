using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BulkyBook.DataAccess.Repository.IRepository;
using BulkyBook.Models;
using BulkyBook.Utility;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace BulkyBook.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = SD.Role_Admin)]
    public class CoverTypeController : Controller
    {
        private readonly IUnitOfWork _uow;
        public CoverTypeController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upsert(int? id)
        {
            CoverType coverType = new CoverType();

            if (id == null)
            {
                return View(coverType);
            }

            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            coverType = _uow.SP_Call.OneRecord<CoverType>(SD.Proc_CoverType_Get, parameters);

            if (coverType == null)
            {
                return NotFound();
            }

            return View(coverType);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert(CoverType coverType)
        {
            if (ModelState.IsValid)
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Name", coverType.Name);

                if (coverType.Id == 0)
                {
                    _uow.SP_Call.Execute(SD.Proc_CoverType_Create, parameters);
                }
                else
                {
                    parameters.Add("@Id", coverType.Id);
                    _uow.SP_Call.Execute(SD.Proc_CoverType_Update, parameters);
                }
                _uow.Save();

                return RedirectToAction(nameof(Index));
            }

            return View(coverType);
        }

        #region API Calls
        [HttpGet]
        public IActionResult GetAll()
        {
            var allObj = _uow.SP_Call.List<CoverType>(SD.Proc_CoverType_GetAll, null);
            return Json(new { data = allObj });
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            var objFromDb = _uow.SP_Call.OneRecord<CoverType>(SD.Proc_CoverType_Get, parameters);

            if (objFromDb == null)
            {
                return Json(new { success = false, message = "No category with inputted ID exists" });
            }

            _uow.SP_Call.Execute(SD.Proc_CoverType_Delete, parameters);
            _uow.Save();

            return Json(new { success = true, message = "Deletion successful" });
        }
        #endregion

    }
}
