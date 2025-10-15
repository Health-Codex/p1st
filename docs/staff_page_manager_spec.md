People First Urgent Care — Staff Page Manager Specification
============================================================

Purpose
-------
- Deliver a single Python 3 script that non-technical staff can run in VS Code to maintain the public `our-staff.html` page.
- Eliminate the need for manual HTML editing while keeping the existing site structure, styling, and accessibility patterns intact.
- Provide a lightweight workflow for managing profile media files (headshots, resumes, documents) alongside structured staff data.

Runtime Requirements
--------------------
- Python 3.9+ (standard macOS installation is sufficient).
- No third-party packages; the script only relies on the Python standard library (`argparse`, `json`, `pathlib`, `shutil`, `textwrap`, etc.).
- Execute with `python3 staff_page_manager.py` from the project root (`/Users/austinshinaberry/Downloads/p1st`).

Data Storage Strategy
---------------------
- Primary data file: `data/staff_directory.json` (created automatically on first run).
- JSON schema:
  ```json
  {
    "meta": {
      "last_updated": "2024-09-16T18:45:00",
      "image_dir": "assets/images/staff",
      "document_dir": "assets/files/staff"
    },
    "medical": [
      {
        "id": "jane-smith",
        "name": "Dr. Jane Smith",
        "title": "Medical Director",
        "credentials": ["MD", "FACEP"],
        "specialties": ["Urgent Care", "Emergency Medicine"],
        "description": "Short bio in plain text.",
        "experience_years": 14,
        "locations": ["Downtown", "Westside"],
        "languages": ["English", "Spanish"],
        "education": "Baylor College of Medicine",
        "email": "jane.smith@example.com",
        "phone": "555-123-4567",
        "linkedin": "https://linkedin.com/in/jane-smith",
        "image": "assets/images/staff/jane-smith.jpg",
        "documents": [
          {
            "label": "Curriculum Vitae",
            "path": "assets/files/staff/jane-smith-cv.pdf"
          }
        ],
        "tags": ["Leadership", "Patient Experience"],
        "featured": true,
        "last_modified": "2024-09-16T18:45:00"
      }
    ],
    "support": [
      {
        "...": "Same fields as medical staff; featured/experience_years optional."
      }
    ]
  }
  ```
- IDs are slugified names and act as stable keys for update/remove operations.
- `meta.image_dir` and `meta.document_dir` define where files are copied. The script ensures these directories exist.

File Management
---------------
- Images stored under `assets/images/staff/`.
- Documents stored under `assets/files/staff/`.
- When adding or updating a staff member, the script:
  1. Prompts for local file paths (optional).
  2. Copies files into the configured directories.
  3. Renames files safely using the staff slug plus the original extension.
- Existing files are not deleted automatically; the script warns when an obsolete file remains unused.

Script Workflow
---------------
- Interactive menu presented on launch:
  1. List medical or support staff.
  2. Add a new profile.
  3. Edit an existing profile.
  4. Remove a profile.
  5. Attach additional documents to a profile.
  6. Generate/preview the staff page.
  7. Exit.
- Each workflow step guides the user with clear prompts, validation, and defaults (e.g., pressing Enter keeps the existing value when editing).
- All changes immediately update `staff_directory.json` so data is never lost if the script exits before HTML generation.

HTML Generation
---------------
- Output file: `our-staff.html` (overwrites existing file after creating a timestamped backup in `backup_staff_pages/our-staff.YYYYMMDD-HHMMSS.html`).
- Template strategy:
  - Static head/hero/footer markup is embedded in a template string that mirrors the current site layout (imports existing CSS, header include, etc.).
  - Staff sections (`Medical Providers`, `Support Staff`) are rendered from the JSON records using semantic markup.
  - Cards use the same class names already used in the site (`staff-card`, `staff-grid`, etc.) to ensure CSS compatibility.
  - Adds ARIA labels, alt text, and `aria-describedby` attributes for better accessibility.
  - If no staff are available in a category, the script outputs an accessible empty-state message rather than leaving an empty container.
- Optional JSON export: `data/staff_directory.webmanifest` for future client-side use (part of the generation routine, can be expanded later).

Accessibility & Responsiveness
------------------------------
- Uses `<article>` for staff entries with `<h3>` for names and `<p>`/`<ul>` for structured details.
- Ensures every image has descriptive alt text; falls back to “Portrait of {Name}”.
- Contact links include descriptive `aria-label`s.
- Layout relies on existing CSS grid rules so the page remains responsive on all breakpoints without additional dependencies.

Error Handling & Logging
------------------------
- Human-readable status messages printed for every major action (load/save data, file copy, generation).
- Input validation for emails, URLs, and numeric fields (basic regex/format checks).
- Exceptions caught at the top level to prevent stack traces; users receive clear instructions on how to recover.

Maintenance & Extensibility
---------------------------
- Script written in a modular style:
  - `StaffDirectory` class handles data persistence.
  - `StaffMember` dataclass-equivalent (dict-based to avoid extra dependencies) centralizes default values.
  - `HTMLRenderer` class encapsulates template composition.
  - `Menu` helper manages interactive prompts and selection logic.
- Future enhancements (multi-location sections, specialty filtering, static JSON feed) can hook into existing data structures without breaking compatibility.
- Documentation embedded at the top of the script (docstring) outlining usage, shortcut commands, and troubleshooting tips.

Testing & Verification
----------------------
- Primary verification: run the script, generate the page, open `our-staff.html` in a browser, and spot-check cards and links.
- Automated smoke check: script validates that referenced files exist, warning if any image/document path is missing.
- Optional suggestion: maintain git commits after each generation to track changes to `our-staff.html` and `staff_directory.json`.

