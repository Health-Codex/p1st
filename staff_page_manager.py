#!/usr/bin/env python3
"""
People First Urgent Care - Staff Page Manager

Run from the project root with:
    python3 staff_page_manager.py

The script provides an interactive GUI (Tkinter) for maintaining staff records,
copying headshots/documents into the correct asset folders, and regenerating the
public our-staff.html page. A CLI fallback remains available via --cli.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import re
import shutil
import sys
import textwrap
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

try:  # Tkinter is part of the stdlib but can be absent on minimal installs
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox, simpledialog
except ImportError:  # pragma: no cover - handled at runtime
    tk = None  # type: ignore
    ttk = filedialog = messagebox = simpledialog = None  # type: ignore


PROJECT_ROOT = Path(__file__).resolve().parent
DATA_DIR = PROJECT_ROOT / "data"
DEFAULT_DATA_PATH = DATA_DIR / "staff_directory.json"
DEFAULT_IMAGE_DIR = PROJECT_ROOT / "assets" / "images" / "staff"
DEFAULT_DOCUMENT_DIR = PROJECT_ROOT / "assets" / "files" / "staff"
OUTPUT_PAGE = PROJECT_ROOT / "our-staff.html"
BACKUP_DIR = PROJECT_ROOT / "backup_staff_pages"
PLACEHOLDER_IMAGE = "assets/images/healthcare-team-professional.jpg"

BRAND_PRIMARY = "#05A65C"
BRAND_PRIMARY_DARK = "#048A4F"
BRAND_DARK = "#0D3B33"
BRAND_TEXT = "#1F2933"
BRAND_MUTED = "#4A5568"
BRAND_BG = "#F5F8F7"
CARD_BG = "#FFFFFF"
BORDER_COLOR = "#DCE4E1"
FONT_BASE = ("Helvetica Neue", 11)
FONT_LABEL = ("Helvetica Neue", 11)
FONT_HEADING = ("Helvetica Neue", 14, "bold")


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-") or "staff-member"


def iso_now() -> str:
    return _dt.datetime.now().replace(microsecond=0).isoformat()


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def print_rule(char: str = "-") -> None:
    print(char * 60)


def format_list(values: List[str]) -> str:
    return ", ".join(values)


def clean_list(text_value: str) -> List[str]:
    return [part.strip() for part in text_value.split(",") if part.strip()]


def normalize_phone(value: str) -> str:
    digits = re.sub(r"[^\d]", "", value)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return value.strip()


def validate_email(email: str) -> bool:
    if not email:
        return True
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def validate_url(url: str) -> bool:
    if not url:
        return True
    return bool(re.match(r"^https?://", url))


def copy_file_to_directory(source: Path, target_dir: Path, target_name: str) -> Path:
    ensure_directory(target_dir)
    target_path = target_dir / target_name
    shutil.copy2(source, target_path)
    return target_path


def store_image_file(directory: "StaffDirectory", source: Path, slug: str) -> str:
    extension = source.suffix.lower() or ".jpg"
    target_name = f"{slug}{extension}"
    stored = copy_file_to_directory(source, directory.image_dir, target_name)
    return str(stored.relative_to(PROJECT_ROOT))


def store_document_file(
    directory: "StaffDirectory", source: Path, slug: str, suffix: Optional[str] = None
) -> str:
    extension = source.suffix.lower() or ".pdf"
    suffix_part = f"-{suffix}" if suffix else ""
    target_name = f"{slug}{suffix_part}{extension}"
    stored = copy_file_to_directory(source, directory.document_dir, target_name)
    return str(stored.relative_to(PROJECT_ROOT))


def write_staff_page(html: str) -> None:
    ensure_directory(BACKUP_DIR)
    if OUTPUT_PAGE.exists():
        timestamp = _dt.datetime.now().strftime("%Y%m%d-%H%M%S")
        backup_path = BACKUP_DIR / f"our-staff.{timestamp}.html"
        shutil.copy2(OUTPUT_PAGE, backup_path)
        print(f"Backed up existing page to {backup_path.relative_to(PROJECT_ROOT)}")
    with OUTPUT_PAGE.open("w", encoding="utf-8") as handle:
        handle.write(html)
    print(f"Wrote updated page to {OUTPUT_PAGE.relative_to(PROJECT_ROOT)}")


@dataclass
class StaffMember:
    id: str
    name: str
    title: str = ""
    credentials: List[str] = field(default_factory=list)
    specialties: List[str] = field(default_factory=list)
    description: str = ""
    experience_years: Optional[int] = None
    locations: List[str] = field(default_factory=list)
    languages: List[str] = field(default_factory=list)
    education: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    image: str = ""
    documents: List[Dict[str, str]] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    featured: bool = False
    last_modified: str = field(default_factory=iso_now)

    def to_dict(self) -> Dict[str, object]:
        return {
            "id": self.id,
            "name": self.name,
            "title": self.title,
            "credentials": self.credentials,
            "specialties": self.specialties,
            "description": self.description,
            "experience_years": self.experience_years,
            "locations": self.locations,
            "languages": self.languages,
            "education": self.education,
            "email": self.email,
            "phone": self.phone,
            "linkedin": self.linkedin,
            "image": self.image,
            "documents": self.documents,
            "tags": self.tags,
            "featured": self.featured,
            "last_modified": self.last_modified,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, object]) -> "StaffMember":
        return cls(
            id=data.get("id", slugify(str(data.get("name", "staff-member")))),
            name=data.get("name", ""),
            title=data.get("title", ""),
            credentials=list(data.get("credentials", [])),
            specialties=list(data.get("specialties", [])),
            description=data.get("description", ""),
            experience_years=data.get("experience_years"),
            locations=list(data.get("locations", [])),
            languages=list(data.get("languages", [])),
            education=data.get("education", ""),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            linkedin=data.get("linkedin", ""),
            image=data.get("image", ""),
            documents=list(data.get("documents", [])),
            tags=list(data.get("tags", [])),
            featured=bool(data.get("featured", False)),
            last_modified=data.get("last_modified", iso_now()),
        )


class StaffDirectory:
    categories = ("medical", "support")

    def __init__(self, data_path: Path = DEFAULT_DATA_PATH):
        self.data_path = data_path
        self.data: Dict[str, object] = {}
        self.load()

    def load(self) -> None:
        ensure_directory(self.data_path.parent)
        if not self.data_path.exists():
            self.data = {
                "meta": {
                    "last_updated": iso_now(),
                    "image_dir": str(DEFAULT_IMAGE_DIR.relative_to(PROJECT_ROOT)),
                    "document_dir": str(DEFAULT_DOCUMENT_DIR.relative_to(PROJECT_ROOT)),
                },
                "medical": [],
                "support": [],
            }
            self.save()
            return
        with self.data_path.open("r", encoding="utf-8") as handle:
            self.data = json.load(handle)
        self.data.setdefault("meta", {})
        self.data["meta"].setdefault(
            "image_dir", str(DEFAULT_IMAGE_DIR.relative_to(PROJECT_ROOT))
        )
        self.data["meta"].setdefault(
            "document_dir", str(DEFAULT_DOCUMENT_DIR.relative_to(PROJECT_ROOT))
        )
        for category in self.categories:
            self.data.setdefault(category, [])

    def save(self) -> None:
        self.data["meta"]["last_updated"] = iso_now()
        with self.data_path.open("w", encoding="utf-8") as handle:
            json.dump(self.data, handle, indent=2, ensure_ascii=False)

    @property
    def image_dir(self) -> Path:
        return PROJECT_ROOT / self.data["meta"]["image_dir"]

    @property
    def document_dir(self) -> Path:
        return PROJECT_ROOT / self.data["meta"]["document_dir"]

    def list_staff(self, category: str) -> List[StaffMember]:
        entries = [StaffMember.from_dict(item) for item in self.data.get(category, [])]
        entries.sort(key=lambda member: member.name.lower())
        return entries

    def find(self, category: str, slug: str) -> Optional[StaffMember]:
        for entry in self.data.get(category, []):
            if entry.get("id") == slug:
                return StaffMember.from_dict(entry)
        return None

    def upsert(self, category: str, member: StaffMember) -> None:
        bucket = self.data.setdefault(category, [])
        for index, entry in enumerate(bucket):
            if entry.get("id") == member.id:
                bucket[index] = member.to_dict()
                self.save()
                return
        bucket.append(member.to_dict())
        self.save()

    def remove(self, category: str, slug: str) -> bool:
        bucket = self.data.get(category, [])
        for index, entry in enumerate(bucket):
            if entry.get("id") == slug:
                del bucket[index]
                self.save()
                return True
        return False


class HTMLRenderer:
    def __init__(self, directory: StaffDirectory):
        self.directory = directory

    def render(self) -> str:
        medical = self.directory.list_staff("medical")
        support = self.directory.list_staff("support")
        warnings = self._collect_media_warnings(medical + support)
        head = self._head_section()
        body = self._body_section(medical, support)
        footer = self._footer_section()
        warning_comment = ""
        if warnings:
            joined = "\n".join(f"  - {warning}" for warning in warnings)
            warning_comment = f"<!-- Media warnings:\n{joined}\n-->\n"
        return warning_comment + head + body + footer

    def _head_section(self) -> str:
        return textwrap.dedent(
            """\
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
                <title>Our Staff - People First Urgent Care</title>
                <meta name="description" content="Meet the dedicated healthcare professionals at People First Urgent Care.">
                <meta name="theme-color" content="#1aa060">
                <link rel="canonical" href="https://www.peoplefirsturgentcare.com/our-staff.html">
                <meta property="og:title" content="Our Staff - People First Urgent Care">
                <meta property="og:description" content="Meet the dedicated healthcare professionals at People First Urgent Care.">
                <meta property="og:type" content="website">
                <meta property="og:url" content="https://www.peoplefirsturgentcare.com/our-staff.html">
                <meta property="og:image" content="https://www.peoplefirsturgentcare.com/assets/images/dr-hamad-ahmad.jpg">
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="Our Staff - People First Urgent Care">
                <meta name="twitter:description" content="Meet the dedicated healthcare professionals at People First Urgent Care.">
                <meta name="twitter:image" content="https://www.peoplefirsturgentcare.com/assets/images/dr-hamad-ahmad.jpg">
                <link rel="icon" href="assets/images/favicon.ico" type="image/x-icon">
                <link rel="stylesheet" href="assets/css/core/mobile-optimizations.css">
                <link rel="stylesheet" href="assets/css/components/compact-layout.css">
                <link rel="stylesheet" href="assets/css/components/advanced-effects.css">
                <link rel="stylesheet" href="assets/css/components/buttons/action-buttons.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <link rel="stylesheet" href="assets/css/core/custom-redesign.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="assets/css/header-system-complete.css">
                <link rel="stylesheet" href="assets/css/layout-fixes.css">
                <style>
                    .staff-card .staff-image.image-zoom-container{
                        display:flex;
                        justify-content:center;
                        align-items:center;
                    }
                    .staff-card .staff-image.image-zoom-container img{
                        margin:0 auto;
                    }
                </style>
            </head>
            """
        )

    def _body_section(self, medical: List[StaffMember], support: List[StaffMember]) -> str:
        return textwrap.dedent(
            f"""\
            <body>
                <div data-include="header"></div>
                <main id="main-content">
                    <section class="page-header page-header-with-bg" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/medical-office-doctors.jpg');">
                        <div class="container">
                            <span class="page-badge">Our Team</span>
                            <h1 class="gradient-text">Our Staff</h1>
                            <p>Meet our team of dedicated healthcare professionals</p>
                        </div>
                        <div class="header-shape-divider">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M0,0V120H1200V0Z" class="shape-fill"></path>
                            </svg>
                        </div>
                    </section>
                    <section class="section">
                        <div class="container">
                            <div class="section-header">
                                <span class="section-badge">Healthcare Experts</span>
                                <h2 class="gradient-text">Medical Providers</h2>
                                <p>Our experienced team of healthcare professionals</p>
                            </div>
                            <div class="staff-grid" role="list" aria-label="Medical providers">
            {self._render_staff_cards(medical)}
                            </div>
                            <div class="section-header">
                                <span class="section-badge">Administrative Team</span>
                                <h2 class="gradient-text">Support Staff</h2>
                                <p>The team that keeps our practice running smoothly</p>
                            </div>
                            <div class="staff-grid support-staff-grid" role="list" aria-label="Support staff">
            {self._render_staff_cards(support)}
                            </div>
                        </div>
                    </section>
                </main>
                <div data-include="footer"></div>
            """
        )

    def _footer_section(self) -> str:
        return textwrap.dedent(
            """\
                <script src="assets/js/core/custom.js" defer></script>
                <script src="assets/js/core/main.js" defer></script>
                <script src="assets/js/mobile/mobile-enhancements.js" defer></script>
                <script src="assets/js/header-inline.js" defer></script>
                <script src="assets/js/footer-inline.js" defer></script>
                <script src="assets/js/core/header-system-new.js" defer></script>
            </body>
            </html>
            """
        )

    def _render_staff_cards(self, members: List[StaffMember]) -> str:
        if not members:
            empty_html = textwrap.dedent(
                """\
                        <div class="empty-state" role="status" aria-live="polite">
                            <p>No staff profiles are available in this section yet. Please check back soon.</p>
                        </div>
                """
            )
            return textwrap.indent(empty_html, " " * 12)
        return "\n".join(self._render_staff_card(member) for member in members)

    def _render_staff_card(self, member: StaffMember) -> str:
        image_path = member.image or PLACEHOLDER_IMAGE
        alt_text = f"Portrait of {member.name}".strip()
        credential_html = ""
        if member.credentials:
            items = "".join(
                f'<span class="credential"><i class="fa-solid fa-certificate"></i> {cred}</span>'
                for cred in member.credentials
            )
            credential_html = f'<div class="staff-credentials">{items}</div>'

        specialty_html = ""
        if member.specialties:
            tags = "".join(
                f'<span class="specialty-tag">{spec}</span>' for spec in member.specialties
            )
            specialty_html = f'<div class="staff-specialties" aria-label="Specialties">{tags}</div>'

        tag_html = ""
        if member.tags:
            tags = "".join(f'<span class="staff-tag">{tag}</span>' for tag in member.tags)
            tag_html = f'<div class="staff-tags" aria-label="Highlights">{tags}</div>'

        contact_links = []
        if member.linkedin:
            contact_links.append(
                f'<a href="{member.linkedin}" class="social-link hover-scale" aria-label="LinkedIn profile for {member.name}"><i class="fa-brands fa-linkedin-in"></i></a>'
            )
        if member.email:
            contact_links.append(
                f'<a href="mailto:{member.email}" class="social-link hover-scale" aria-label="Email {member.name}"><i class="fa-solid fa-envelope"></i></a>'
            )
        if member.phone:
            tel_link = re.sub(r"[^\d+]", "", member.phone)
            contact_links.append(
                f'<a href="tel:{tel_link}" class="social-link hover-scale" aria-label="Call {member.name}"><i class="fa-solid fa-phone"></i></a>'
            )
        contact_html = ""
        if contact_links:
            contact_html = (
                '<div class="staff-social" role="group" aria-label="Contact links">'
                + "".join(contact_links)
                + "</div>"
            )

        document_html = ""
        if member.documents:
            items = "".join(
                f"<li><a href='{doc['path']}' aria-label='{member.name} - {doc['label']}' download><i class='fa-solid fa-file-arrow-down'></i> {doc['label']}</a></li>"
                for doc in member.documents
            )
            document_html = (
                '<div class="staff-documents"><p class="staff-documents-title">'
                '<i class="fa-solid fa-file-lines"></i> Featured Documents</p>'
                f"<ul>{items}</ul></div>"
            )

        info_lines: List[str] = []
        if member.experience_years is not None:
            info_lines.append(
                f'<span class="experience-badge">{member.experience_years}+ years experience</span>'
            )
        if member.education:
            info_lines.append(
                f'<p class="staff-education"><i class="fa-solid fa-graduation-cap"></i> {member.education}</p>'
            )
        if member.locations:
            info_lines.append(
                f'<p class="staff-locations"><i class="fa-solid fa-location-dot"></i> {format_list(member.locations)}</p>'
            )
        if member.languages:
            info_lines.append(
                f'<p class="staff-languages"><i class="fa-solid fa-language"></i> {format_list(member.languages)}</p>'
            )
        info_html = "".join(info_lines)

        featured_html = (
            '<span class="staff-specialty-badge">Featured Provider</span>'
            if member.featured
            else ""
        )

        description = textwrap.fill(member.description.strip(), width=90)
        description_html = (
            f'<p class="staff-bio">{description}</p>' if description else ""
        )

        card_html = textwrap.dedent(
            f"""\
                        <article class="staff-card hover-lift shadow-soft" role="listitem" data-staff-id="{member.id}">
                            <div class="staff-image image-zoom-container">
                                <img src="{image_path}" alt="{alt_text}" loading="lazy" class="image-zoom">
                                {contact_html}
                            </div>
                            <div class="staff-info">
                                {featured_html}
                                <h3 class="staff-name">{member.name}</h3>
                                <p class="staff-title"><i class="fa-solid fa-user-md"></i> {member.title}</p>
                                {credential_html}
                                {info_html}
                                {description_html}
                                {specialty_html}
                                {tag_html}
                                {document_html}
                            </div>
                        </article>
            """
        ).rstrip("\n")

        return textwrap.indent(card_html, " " * 12)

    def _collect_media_warnings(self, members: List[StaffMember]) -> List[str]:
        warnings: List[str] = []
        for member in members:
            if member.image:
                image_path = PROJECT_ROOT / member.image
                if not image_path.exists():
                    warnings.append(f"Missing image for {member.name}: {member.image}")
            for doc in member.documents:
                doc_path = PROJECT_ROOT / doc.get("path", "")
                if doc.get("path") and not doc_path.exists():
                    warnings.append(f"Missing document for {member.name}: {doc['path']}")
        return warnings


class StaffManagerCLI:
    def __init__(self, directory: StaffDirectory):
        self.directory = directory

    def run(self) -> None:
        while True:
            print_rule("=")
            print("People First Urgent Care — Staff Page Manager")
            print_rule("=")
            print("1) List staff")
            print("2) Add staff member")
            print("3) Edit staff member")
            print("4) Remove staff member")
            print("5) Attach documents")
            print("6) Generate staff page")
            print("7) Quit")
            choice = input("Select an option: ").strip()
            if choice == "1":
                self.handle_list()
            elif choice == "2":
                self.handle_add()
            elif choice == "3":
                self.handle_edit()
            elif choice == "4":
                self.handle_remove()
            elif choice == "5":
                self.handle_attach_documents()
            elif choice == "6":
                self.handle_generate()
            elif choice == "7":
                print("Goodbye!")
                break
            else:
                print("Invalid selection. Please try again.")

    def handle_list(self) -> None:
        category = self.prompt_category()
        members = self.directory.list_staff(category)
        if not members:
            print(f"No {category} staff found.")
            return
        print_rule()
        for member in members:
            print(f"{member.name} — {member.title}")
            print(f"  ID: {member.id}")
            if member.specialties:
                print(f"  Specialties: {format_list(member.specialties)}")
            if member.email:
                print(f"  Email: {member.email}")
            if member.phone:
                print(f"  Phone: {member.phone}")
            print_rule()

    def handle_add(self) -> None:
        category = self.prompt_category()
        print("Enter staff information. Leave blank to skip optional fields.")
        details = self.prompt_member_details()
        slug = slugify(details["name"])
        if self.directory.find(category, slug):
            print("A staff member with this name already exists. Please edit instead.")
            return
        member = StaffMember.from_dict({"id": slug, **details})
        self.directory.upsert(category, member)
        print(f"Added {member.name} to {category} staff.")

    def handle_edit(self) -> None:
        category = self.prompt_category()
        slug = self.prompt_member_slug(category)
        if not slug:
            return
        member = self.directory.find(category, slug)
        if not member:
            print("Staff member not found.")
            return
        print(f"Editing {member.name}. Press Enter to keep the current value.")
        updated = self.prompt_member_details(existing=member)
        member = StaffMember.from_dict({"id": slug, **updated})
        self.directory.upsert(category, member)
        print(f"Updated {member.name}.")

    def handle_remove(self) -> None:
        category = self.prompt_category()
        slug = self.prompt_member_slug(category)
        if not slug:
            return
        member = self.directory.find(category, slug)
        if not member:
            print("No staff member found with that ID.")
            return
        confirm = input(f"Type DELETE to remove {member.name}: ").strip()
        if confirm != "DELETE":
            print("Cancelled.")
            return
        if self.directory.remove(category, slug):
            print(f"Removed {member.name}.")
        else:
            print("Could not remove member (not found).")

    def handle_attach_documents(self) -> None:
        category = self.prompt_category()
        slug = self.prompt_member_slug(category)
        if not slug:
            return
        member = self.directory.find(category, slug)
        if not member:
            print("Staff member not found.")
            return
        while True:
            label = input("Document label (e.g., Curriculum Vitae) [blank to stop]: ").strip()
            if not label:
                break
            doc_path = self.prompt_file_path("Path to document file")
            if not doc_path:
                print("Skipped document.")
                continue
            stored_path = store_document_file(self.directory, doc_path, member.id, suffix=slugify(label))
            member.documents.append({"label": label, "path": stored_path})
            member.last_modified = iso_now()
            self.directory.upsert(category, member)
            print(f"Attached document '{label}'.")

    def handle_generate(self) -> None:
        renderer = HTMLRenderer(self.directory)
        html = renderer.render()
        write_staff_page(html)
        print("Staff page generated successfully.")

    def prompt_category(self) -> str:
        while True:
            choice = input("Select category: [1] Medical, [2] Support: ").strip().lower()
            if choice in ("1", "medical", "m"):
                return "medical"
            if choice in ("2", "support", "s"):
                return "support"
            print("Invalid choice. Please enter 1 or 2.")

    def prompt_member_slug(self, category: str) -> Optional[str]:
        members = self.directory.list_staff(category)
        if not members:
            print("No staff available.")
            return None
        for index, member in enumerate(members, start=1):
            print(f"[{index}] {member.name} ({member.id})")
        choice = input("Select a staff member by number or enter an ID: ").strip()
        if not choice:
            return None
        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(members):
                return members[idx].id
            print("Invalid number.")
            return None
        return choice

    def prompt_member_details(self, existing: Optional[StaffMember] = None) -> Dict[str, object]:
        def ask(prompt_text: str, default: str = "") -> str:
            if default:
                response = input(f"{prompt_text} [{default}]: ").strip()
                return response or default
            return input(f"{prompt_text}: ").strip()

        name = ask("Full name", existing.name if existing else "")
        while not name:
            print("Name is required.")
            name = input("Full name: ").strip()
        title = ask("Title", existing.title if existing else "")
        credentials = ask(
            "Credentials (comma separated)",
            format_list(existing.credentials) if existing and existing.credentials else "",
        )
        specialties = ask(
            "Specialties (comma separated)",
            format_list(existing.specialties) if existing and existing.specialties else "",
        )
        description = ask("Short bio/description", existing.description if existing else "")
        experience = ask(
            "Years of experience",
            str(existing.experience_years) if existing and existing.experience_years is not None else "",
        )
        experience_years = int(experience) if experience.isdigit() else None
        locations = ask(
            "Primary clinic locations (comma separated)",
            format_list(existing.locations) if existing and existing.locations else "",
        )
        languages = ask(
            "Languages (comma separated)",
            format_list(existing.languages) if existing and existing.languages else "",
        )
        education = ask("Education", existing.education if existing else "")
        email = ask("Email", existing.email if existing else "")
        while email and not validate_email(email):
            print("Invalid email format.")
            email = ask("Email", existing.email if existing else "")
        phone = ask("Phone", existing.phone if existing else "")
        phone = normalize_phone(phone) if phone else ""
        linkedin = ask("LinkedIn URL", existing.linkedin if existing else "")
        while linkedin and not validate_url(linkedin):
            print("Invalid URL. Must start with http:// or https://")
            linkedin = ask("LinkedIn URL", existing.linkedin if existing else "")
        tags = ask(
            "Highlight tags (comma separated)",
            format_list(existing.tags) if existing and existing.tags else "",
        )
        featured_input = ask(
            "Feature this provider? (y/N)",
            "y" if existing and existing.featured else "n",
        )
        featured = featured_input.lower() in ("y", "yes")

        image_path = existing.image if existing else ""
        if ask("Update headshot image? (y/N)", "n").lower() in ("y", "yes"):
            image_file = self.prompt_file_path("Path to image file")
            if image_file:
                image_path = store_image_file(self.directory, image_file, slugify(name))

        documents = existing.documents[:] if existing else []
        if ask("Update supporting documents? (y/N)", "n").lower() in ("y", "yes"):
            documents = []
            while True:
                label = input("Document label (blank to finish): ").strip()
                if not label:
                    break
                doc_src = self.prompt_file_path("Path to document file")
                if not doc_src:
                    print("No document selected, skipping.")
                    continue
                stored = store_document_file(
                    self.directory, doc_src, slugify(name), suffix=slugify(label)
                )
                documents.append({"label": label, "path": stored})

        return {
            "name": name,
            "title": title,
            "credentials": clean_list(credentials),
            "specialties": clean_list(specialties),
            "description": description,
            "experience_years": experience_years,
            "locations": clean_list(locations),
            "languages": clean_list(languages),
            "education": education,
            "email": email,
            "phone": phone,
            "linkedin": linkedin,
            "image": image_path,
            "documents": documents,
            "tags": clean_list(tags),
            "featured": featured,
            "last_modified": iso_now(),
        }

    def prompt_file_path(self, prompt_text: str) -> Optional[Path]:
        path_text = input(f"{prompt_text}: ").strip()
        if not path_text:
            return None
        path = Path(path_text).expanduser()
        if not path.exists():
            print("File does not exist.")
            return None
        return path


class ScrollableFrame(ttk.Frame):
    def __init__(self, parent: tk.Widget, style: str = "Card.TFrame", **kwargs):
        super().__init__(parent, style=style, **kwargs)
        self.columnconfigure(0, weight=1)
        self.rowconfigure(0, weight=1)

        self.canvas = tk.Canvas(
            self,
            background=CARD_BG,
            highlightthickness=0,
            bd=0,
        )
        self.v_scroll = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.v_scroll.set)
        self.canvas.grid(row=0, column=0, sticky="nsew")
        self.v_scroll.grid(row=0, column=1, sticky="ns")

        self.content = ttk.Frame(self.canvas, style=style)
        self.content.columnconfigure(0, weight=1)
        self._window = self.canvas.create_window((0, 0), window=self.content, anchor="nw")

        self.content.bind("<Configure>", self._on_frame_configure)
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        self._bind_scroll_events(self.canvas)
        self._bind_scroll_events(self.content)

    def _on_frame_configure(self, event: tk.Event) -> None:
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _on_canvas_configure(self, event: tk.Event) -> None:
        width = event.width
        self.canvas.itemconfigure(self._window, width=width)

    def _bind_scroll_events(self, widget: tk.Widget) -> None:
        widget.bind("<MouseWheel>", self._on_mousewheel, add="+")
        widget.bind("<Button-4>", self._on_mousewheel, add="+")
        widget.bind("<Button-5>", self._on_mousewheel, add="+")

    def _on_mousewheel(self, event: tk.Event) -> None:
        if getattr(event, "num", None) == 5 or event.delta < 0:
            self.canvas.yview_scroll(1, "units")
        elif getattr(event, "num", None) == 4 or event.delta > 0:
            self.canvas.yview_scroll(-1, "units")


class StaffManagerGUI:
    def __init__(self, directory: StaffDirectory):
        if tk is None:
            raise RuntimeError("Tkinter is not available in this environment.")
        self.directory = directory
        self.root = tk.Tk()
        self.root.title("People First Urgent Care — Staff Manager")
        self.root.geometry("1200x720")
        self.root.minsize(1100, 650)

        self.style: Optional[ttk.Style] = None
        self.category_var = tk.StringVar(value="medical")
        self.name_var = tk.StringVar()
        self.title_var = tk.StringVar()
        self.credentials_var = tk.StringVar()
        self.specialties_var = tk.StringVar()
        self.experience_var = tk.StringVar()
        self.locations_var = tk.StringVar()
        self.languages_var = tk.StringVar()
        self.education_var = tk.StringVar()
        self.email_var = tk.StringVar()
        self.phone_var = tk.StringVar()
        self.linkedin_var = tk.StringVar()
        self.tags_var = tk.StringVar()
        self.image_var = tk.StringVar()
        self.featured_var = tk.BooleanVar(value=False)
        self.status_var = tk.StringVar(value="Ready.")

        self.status_label: Optional[ttk.Label] = None
        self._pending_status_style = "Status.TLabel"
        self.current_slug: Optional[str] = None
        self.document_data: List[Dict[str, str]] = []
        self.current_members: List[StaffMember] = []
        self.audit_history: List[str] = []
        self.audit_listbox: Optional[tk.Listbox] = None

        self._configure_theme()

        self._build_ui()
        self.refresh_staff_list()

    def run(self) -> None:
        self.root.mainloop()

    def _configure_theme(self) -> None:
        self.root.configure(background=BRAND_BG)
        style = ttk.Style(self.root)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        self.root.option_add("*Font", FONT_BASE)

        style.configure(".", background=BRAND_BG, foreground=BRAND_TEXT, font=FONT_BASE)
        style.configure("Main.TFrame", background=BRAND_BG)
        style.configure("Sidebar.TFrame", background=CARD_BG)
        style.configure("SidebarHeader.TLabel", background=CARD_BG, foreground=BRAND_PRIMARY, font=("Helvetica Neue", 12, "bold"))
        style.configure("Card.TFrame", background=CARD_BG)
        style.configure("Card.TLabelframe", background=CARD_BG, borderwidth=1, relief="solid")
        style.configure("Card.TLabelframe.Label", background=CARD_BG, foreground=BRAND_DARK, font=FONT_HEADING)
        style.configure("CardLabel.TLabel", background=CARD_BG, foreground=BRAND_MUTED, font=FONT_LABEL)
        style.configure("Card.TEntry", fieldbackground=CARD_BG, foreground=BRAND_TEXT)
        style.map("Card.TEntry", fieldbackground=[("focus", "#FFFFFF")])
        style.configure("Card.TCombobox", fieldbackground=CARD_BG, background=CARD_BG, foreground=BRAND_TEXT)
        style.map("Card.TCombobox", fieldbackground=[("focus", "#FFFFFF")])
        style.configure("Card.TCheckbutton", background=CARD_BG, foreground=BRAND_TEXT, font=FONT_LABEL)
        style.configure("Accent.TButton", background=BRAND_PRIMARY, foreground="#FFFFFF", padding=(12, 6), font=("Helvetica Neue", 11, "bold"), borderwidth=0)
        style.map("Accent.TButton", background=[("active", BRAND_PRIMARY_DARK), ("disabled", "#A0AEC0")])
        style.configure("Secondary.TButton", background="#E2E8F0", foreground=BRAND_DARK, padding=(12, 6), font=FONT_LABEL, borderwidth=0)
        style.map("Secondary.TButton", background=[("active", "#CBD5E1")])
        style.configure("Danger.TButton", background="#E53E3E", foreground="#FFFFFF", padding=(12, 6), font=FONT_LABEL, borderwidth=0)
        style.map("Danger.TButton", background=[("active", "#C53030")])
        style.configure("Status.TLabel", background=BRAND_PRIMARY, foreground="#FFFFFF", font=FONT_LABEL, padding=(12, 6))
        style.configure("StatusWarning.TLabel", background="#C05621", foreground="#FFFFFF", font=FONT_LABEL, padding=(12, 6))

        self.root.option_add("*TCombobox*Listbox*Font", FONT_BASE)
        self.root.option_add("*TCombobox*Listbox*Background", CARD_BG)
        self.root.option_add("*TCombobox*Listbox*Foreground", BRAND_TEXT)
        self.style = style

    def _build_ui(self) -> None:
        main_frame = ttk.Frame(self.root, padding=16, style="Main.TFrame")
        main_frame.pack(fill="both", expand=True)
        main_frame.columnconfigure(0, weight=1, uniform="cols")
        main_frame.columnconfigure(1, weight=2, uniform="cols")
        main_frame.rowconfigure(0, weight=1)

        # Left pane: category and staff list
        left = ttk.Frame(main_frame, style="Sidebar.TFrame", padding=16)
        left.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        left.rowconfigure(2, weight=1)

        ttk.Label(left, text="Staff Category", style="SidebarHeader.TLabel").grid(row=0, column=0, sticky="w")
        category_combo = ttk.Combobox(
            left,
            textvariable=self.category_var,
            values=("medical", "support"),
            state="readonly",
            style="Card.TCombobox",
        )
        category_combo.grid(row=1, column=0, sticky="ew", pady=(4, 12))
        category_combo.bind("<<ComboboxSelected>>", lambda event: self.on_category_change())

        list_frame = ttk.Frame(left, style="Card.TFrame", borderwidth=1, relief="solid")
        list_frame.grid(row=2, column=0, sticky="nsew")
        list_frame.rowconfigure(0, weight=1)
        list_frame.columnconfigure(0, weight=1)

        self.staff_listbox = tk.Listbox(list_frame, exportselection=False)
        self.staff_listbox.grid(row=0, column=0, sticky="nsew")
        self.staff_listbox.bind("<<ListboxSelect>>", self.on_select_staff)
        self.staff_listbox.configure(
            bg=CARD_BG,
            fg=BRAND_TEXT,
            selectbackground=BRAND_PRIMARY,
            selectforeground="#FFFFFF",
            highlightthickness=1,
            highlightcolor=BORDER_COLOR,
            highlightbackground=BORDER_COLOR,
            relief="flat",
            borderwidth=0,
        )

        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.staff_listbox.yview)
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.staff_listbox.configure(yscrollcommand=scrollbar.set)

        button_frame = ttk.Frame(left, style="Sidebar.TFrame")
        button_frame.grid(row=3, column=0, sticky="ew", pady=(12, 0))
        button_frame.columnconfigure(0, weight=1)
        button_frame.columnconfigure(1, weight=1)
        ttk.Button(button_frame, text="New Staff", command=self.clear_form, style="Accent.TButton").grid(row=0, column=0, sticky="ew", pady=4, padx=(0, 6))
        ttk.Button(button_frame, text="Duplicate", command=self.duplicate_member, style="Secondary.TButton").grid(row=0, column=1, sticky="ew", pady=4)
        ttk.Button(button_frame, text="Delete", command=self.delete_member, style="Danger.TButton").grid(row=1, column=0, sticky="ew", pady=4, padx=(0, 6))
        ttk.Button(button_frame, text="Generate Page", command=self.generate_page, style="Accent.TButton").grid(row=1, column=1, sticky="ew", pady=4)

        # Right pane: form
        right = ttk.Frame(main_frame, style="Main.TFrame")
        right.grid(row=0, column=1, sticky="nsew")
        right.columnconfigure(0, weight=1)
        right.rowconfigure(0, weight=1)
        right.rowconfigure(1, weight=0)

        form_scroll = ScrollableFrame(right, style="Card.TFrame")
        form_scroll.grid(row=0, column=0, sticky="nsew", pady=(0, 12))
        form_scroll.content.columnconfigure(0, weight=1)

        form = ttk.LabelFrame(form_scroll.content, text="Staff Details", padding=16, style="Card.TLabelframe")
        form.grid(row=0, column=0, sticky="nsew")
        for col in range(2):
            form.columnconfigure(col, weight=1)

        row = 0
        self._add_labeled_entry(form, "Full Name *", self.name_var, row)
        row += 1
        self._add_labeled_entry(form, "Title", self.title_var, row)
        row += 1
        self._add_labeled_entry(form, "Credentials (comma separated)", self.credentials_var, row)
        row += 1
        self._add_labeled_entry(form, "Specialties (comma separated)", self.specialties_var, row)
        row += 1

        ttk.Label(form, text="Short Bio / Description", style="CardLabel.TLabel").grid(row=row, column=0, sticky="nw", pady=(6, 2))
        self.description_text = tk.Text(form, height=6, wrap="word")
        self.description_text.grid(row=row, column=1, sticky="ew", pady=(6, 2))
        self.description_text.configure(
            bg=CARD_BG,
            fg=BRAND_TEXT,
            insertbackground=BRAND_PRIMARY,
            highlightcolor=BRAND_PRIMARY,
            highlightbackground=BORDER_COLOR,
            highlightthickness=1,
            borderwidth=0,
            relief="flat",
            padx=6,
            pady=6,
        )
        row += 1

        self._add_labeled_entry(form, "Years of Experience", self.experience_var, row)
        row += 1
        self._add_labeled_entry(form, "Primary Clinic Locations", self.locations_var, row)
        row += 1
        self._add_labeled_entry(form, "Languages", self.languages_var, row)
        row += 1
        self._add_labeled_entry(form, "Education", self.education_var, row)
        row += 1
        self._add_labeled_entry(form, "Email", self.email_var, row)
        row += 1
        self._add_labeled_entry(form, "Phone", self.phone_var, row)
        row += 1
        self._add_labeled_entry(form, "LinkedIn URL", self.linkedin_var, row)
        row += 1
        self._add_labeled_entry(form, "Highlight Tags", self.tags_var, row)
        row += 1

        # Image selector
        ttk.Label(form, text="Headshot Image", style="CardLabel.TLabel").grid(row=row, column=0, sticky="w", pady=(6, 2))
        image_frame = ttk.Frame(form, style="Card.TFrame")
        image_frame.grid(row=row, column=1, sticky="ew", pady=(6, 2))
        image_frame.columnconfigure(0, weight=1)
        image_entry = ttk.Entry(image_frame, textvariable=self.image_var, state="readonly", style="Card.TEntry")
        image_entry.grid(row=0, column=0, sticky="ew")
        ttk.Button(image_frame, text="Choose…", command=self.choose_image, style="Secondary.TButton").grid(row=0, column=1, padx=(6, 0))
        row += 1

        featured_check = ttk.Checkbutton(
            form, text="Featured Provider", variable=self.featured_var, style="Card.TCheckbutton"
        )
        featured_check.grid(row=row, column=1, sticky="w", pady=(6, 2))
        row += 1

        # Documents list
        ttk.Label(form, text="Documents", style="CardLabel.TLabel").grid(row=row, column=0, sticky="nw", pady=(6, 2))
        docs_frame = ttk.Frame(form, style="Card.TFrame")
        docs_frame.grid(row=row, column=1, sticky="nsew", pady=(6, 2))
        docs_frame.columnconfigure(0, weight=1)
        docs_frame.rowconfigure(0, weight=1)

        self.document_listbox = tk.Listbox(docs_frame, height=4)
        self.document_listbox.grid(row=0, column=0, sticky="nsew")
        self.document_listbox.configure(
            bg=CARD_BG,
            fg=BRAND_TEXT,
            selectbackground=BRAND_PRIMARY,
            selectforeground="#FFFFFF",
            highlightthickness=1,
            highlightbackground=BORDER_COLOR,
            highlightcolor=BORDER_COLOR,
            relief="flat",
            borderwidth=0,
        )
        doc_scroll = ttk.Scrollbar(docs_frame, orient="vertical", command=self.document_listbox.yview)
        doc_scroll.grid(row=0, column=1, sticky="ns")
        self.document_listbox.configure(yscrollcommand=doc_scroll.set)

        doc_button_frame = ttk.Frame(docs_frame, style="Card.TFrame")
        doc_button_frame.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(6, 0))
        ttk.Button(doc_button_frame, text="Add Document", command=self.add_document, style="Secondary.TButton").grid(row=0, column=0, sticky="ew")
        ttk.Button(doc_button_frame, text="Remove Selected", command=self.remove_document, style="Danger.TButton").grid(row=0, column=1, sticky="ew", padx=(6, 0))
        doc_button_frame.columnconfigure(0, weight=1)
        doc_button_frame.columnconfigure(1, weight=1)
        row += 1

        action_row = ttk.Frame(form, style="Card.TFrame")
        action_row.grid(row=row, column=0, columnspan=2, sticky="ew", pady=(12, 0))
        ttk.Button(action_row, text="Save Changes", command=self.save_member, style="Accent.TButton").grid(row=0, column=0, sticky="ew")
        ttk.Button(action_row, text="Export JSON Only", command=self.export_json_only, style="Secondary.TButton").grid(row=0, column=1, sticky="ew", padx=(6, 0))
        ttk.Button(action_row, text="Generate Page Now", command=self.generate_page, style="Accent.TButton").grid(row=0, column=2, sticky="ew")
        action_row.columnconfigure(0, weight=1)
        action_row.columnconfigure(1, weight=1)
        action_row.columnconfigure(2, weight=1)

        log_frame = ttk.LabelFrame(right, text="Activity Log", padding=12, style="Card.TLabelframe")
        log_frame.grid(row=1, column=0, sticky="nsew", pady=(16, 0))
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)

        self.audit_listbox = tk.Listbox(log_frame, height=6)
        self.audit_listbox.grid(row=0, column=0, sticky="nsew")
        self.audit_listbox.configure(
            bg=CARD_BG,
            fg=BRAND_MUTED,
            selectbackground=BRAND_PRIMARY,
            selectforeground="#FFFFFF",
            highlightthickness=1,
            highlightbackground=BORDER_COLOR,
            highlightcolor=BORDER_COLOR,
            relief="flat",
            borderwidth=0,
        )
        audit_scroll = ttk.Scrollbar(log_frame, orient="vertical", command=self.audit_listbox.yview)
        audit_scroll.grid(row=0, column=1, sticky="ns")
        self.audit_listbox.configure(yscrollcommand=audit_scroll.set)

        self.status_label = ttk.Label(self.root, textvariable=self.status_var, anchor="w", style="Status.TLabel")
        self.status_label.pack(fill="x", padx=16, pady=(0, 8))
        if self._pending_status_style:
            self.status_label.configure(style=self._pending_status_style)
            self._pending_status_style = "Status.TLabel"

    def _add_labeled_entry(self, parent: ttk.Frame, label: str, variable: tk.StringVar, row: int) -> None:
        ttk.Label(parent, text=label, style="CardLabel.TLabel").grid(row=row, column=0, sticky="w", pady=(6, 2))
        entry = ttk.Entry(parent, textvariable=variable, style="Card.TEntry")
        entry.grid(row=row, column=1, sticky="ew", pady=(6, 2))

    def set_status(self, message: str, error: bool = False) -> None:
        style_name = "StatusWarning.TLabel" if error else "Status.TLabel"
        prefix = "⚠ " if error else ""
        if self.status_label is not None:
            self.status_label.configure(style=style_name)
        else:
            self._pending_status_style = style_name
        self.status_var.set(f"{prefix}{message}")

    def refresh_staff_list(self, select_slug: Optional[str] = None) -> None:
        category = self.category_var.get()
        self.current_members = self.directory.list_staff(category)
        self.staff_listbox.delete(0, tk.END)
        for member in self.current_members:
            label = f"{member.name} — {member.title}" if member.title else member.name
            self.staff_listbox.insert(tk.END, label)
        if select_slug:
            for idx, member in enumerate(self.current_members):
                if member.id == select_slug:
                    self.staff_listbox.selection_clear(0, tk.END)
                    self.staff_listbox.selection_set(idx)
                    self.staff_listbox.activate(idx)
                    self.staff_listbox.see(idx)
                    self.load_member(member)
                    break

    def on_category_change(self) -> None:
        self.clear_form()
        self.refresh_staff_list()

    def on_select_staff(self, _event: object) -> None:
        selection = self.staff_listbox.curselection()
        if not selection:
            return
        member = self.current_members[selection[0]]
        self.load_member(member)

    def load_member(self, member: StaffMember) -> None:
        self.current_slug = member.id
        self.name_var.set(member.name)
        self.title_var.set(member.title)
        self.credentials_var.set(format_list(member.credentials))
        self.specialties_var.set(format_list(member.specialties))
        self.description_text.delete("1.0", tk.END)
        self.description_text.insert("1.0", member.description.strip())
        self.experience_var.set("" if member.experience_years is None else str(member.experience_years))
        self.locations_var.set(format_list(member.locations))
        self.languages_var.set(format_list(member.languages))
        self.education_var.set(member.education)
        self.email_var.set(member.email)
        self.phone_var.set(member.phone)
        self.linkedin_var.set(member.linkedin)
        self.tags_var.set(format_list(member.tags))
        self.image_var.set(member.image)
        self.featured_var.set(member.featured)
        self.document_data = [dict(doc) for doc in member.documents]
        self._refresh_document_list()
        self.set_status(f"Loaded {member.name}.")

    def clear_form(self) -> None:
        self.current_slug = None
        self.staff_listbox.selection_clear(0, tk.END)
        self.name_var.set("")
        self.title_var.set("")
        self.credentials_var.set("")
        self.specialties_var.set("")
        self.description_text.delete("1.0", tk.END)
        self.experience_var.set("")
        self.locations_var.set("")
        self.languages_var.set("")
        self.education_var.set("")
        self.email_var.set("")
        self.phone_var.set("")
        self.linkedin_var.set("")
        self.tags_var.set("")
        self.image_var.set("")
        self.featured_var.set(False)
        self.document_data = []
        self._refresh_document_list()
        self.set_status("Ready.")

    def collect_form_data(self) -> Optional[Dict[str, object]]:
        name = self.name_var.get().strip()
        if not name:
            messagebox.showerror("Validation error", "Name is required.")
            return None
        slug_candidate = self.current_slug or slugify(name)
        email = self.email_var.get().strip()
        if email and not validate_email(email):
            messagebox.showerror("Validation error", "Email address is not valid.")
            return None
        linkedin = self.linkedin_var.get().strip()
        if linkedin and not validate_url(linkedin):
            messagebox.showerror("Validation error", "LinkedIn URL must start with http:// or https://")
            return None
        experience = self.experience_var.get().strip()
        experience_years: Optional[int] = None
        if experience:
            if experience.isdigit():
                experience_years = int(experience)
            else:
                messagebox.showerror("Validation error", "Years of experience must be a whole number.")
                return None

        description = self.description_text.get("1.0", tk.END).strip()
        phone = normalize_phone(self.phone_var.get().strip()) if self.phone_var.get().strip() else ""

        try:
            image_path = self._ensure_image_asset(self.image_var.get().strip(), slug_candidate)
        except ValueError:
            return None

        try:
            documents = self._ensure_document_assets(slug_candidate)
        except ValueError:
            return None

        return {
            "name": name,
            "title": self.title_var.get().strip(),
            "credentials": clean_list(self.credentials_var.get()),
            "specialties": clean_list(self.specialties_var.get()),
            "description": description,
            "experience_years": experience_years,
            "locations": clean_list(self.locations_var.get()),
            "languages": clean_list(self.languages_var.get()),
            "education": self.education_var.get().strip(),
            "email": email,
            "phone": phone,
            "linkedin": linkedin,
            "image": image_path,
            "documents": documents,
            "tags": clean_list(self.tags_var.get()),
            "featured": bool(self.featured_var.get()),
            "last_modified": iso_now(),
        }

    def save_member(self) -> None:
        data = self.collect_form_data()
        if not data:
            return
        category = self.category_var.get()
        slug = self.current_slug or slugify(data["name"])  # type: ignore[arg-type]
        existing = self.directory.find(category, slug)
        if existing and self.current_slug is None:
            overwrite = messagebox.askyesno(
                "Overwrite existing record",
                "A staff member with this name already exists. Update the existing record?",
            )
            if not overwrite:
                return
        member = StaffMember.from_dict({"id": slug, **data})
        self.directory.upsert(category, member)
        self.current_slug = slug
        self.refresh_staff_list(select_slug=slug)
        self.set_status(f"Saved {member.name}.")
        messagebox.showinfo("Staff saved", f"{member.name} has been saved.")
        self.log_audit(f"Saved staff member {member.name}")

    def delete_member(self) -> None:
        if not self.current_slug:
            messagebox.showinfo("No selection", "Please select a staff member to delete.")
            return
        category = self.category_var.get()
        member = self.directory.find(category, self.current_slug)
        if not member:
            messagebox.showerror("Not found", "The selected staff member could not be located.")
            return
        confirm = messagebox.askyesno(
            "Confirm delete", f"Remove {member.name} from the directory?"
        )
        if not confirm:
            return
        if self.directory.remove(category, member.id):
            self.clear_form()
            self.refresh_staff_list()
            self.set_status(f"Removed {member.name}.")
            messagebox.showinfo("Deleted", f"{member.name} has been removed.")
            self.log_audit(f"Deleted staff member {member.name}")

    def choose_image(self) -> None:
        if filedialog is None:
            return
        if not self.name_var.get().strip():
            messagebox.showerror("Missing name", "Enter the staff member's name before choosing an image.")
            return
        file_path = filedialog.askopenfilename(
            title="Select headshot image",
            filetypes=(
                ("Image files", "*.jpg *.jpeg *.png *.webp *.gif"),
                ("All files", "*.*"),
            ),
        )
        if not file_path:
            return
        slug = self.current_slug or slugify(self.name_var.get())
        stored = store_image_file(self.directory, Path(file_path), slug)
        self.image_var.set(stored)
        self.set_status("Image saved.")
        self.log_audit(f"Updated headshot for {self.name_var.get().strip() or slug}")

    def add_document(self) -> None:
        if filedialog is None or simpledialog is None:
            return
        if not self.name_var.get().strip():
            messagebox.showerror("Missing name", "Enter the staff member's name before adding documents.")
            return
        label = simpledialog.askstring("Document Label", "Document label:")
        if not label:
            return
        file_path = filedialog.askopenfilename(
            title="Select document",
            filetypes=(
                ("PDF files", "*.pdf"),
                ("Word documents", "*.doc *.docx"),
                ("All files", "*.*"),
            ),
        )
        if not file_path:
            return
        slug = self.current_slug or slugify(self.name_var.get())
        stored = store_document_file(self.directory, Path(file_path), slug, suffix=slugify(label))
        self.document_data.append({"label": label, "path": stored})
        self._refresh_document_list()
        self.set_status(f"Added document '{label}'.")
        self.log_audit(f"Attached document '{label}'")

    def remove_document(self) -> None:
        selection = self.document_listbox.curselection()
        if not selection:
            messagebox.showinfo("No selection", "Select a document to remove.")
            return
        idx = selection[0]
        doc = self.document_data[idx]
        confirm = messagebox.askyesno(
            "Remove document", f"Remove '{doc['label']}' from this staff member?"
        )
        if not confirm:
            return
        del self.document_data[idx]
        self._refresh_document_list()
        self.set_status(f"Removed document '{doc['label']}'.")
        self.log_audit(f"Removed document '{doc['label']}'")

    def _refresh_document_list(self) -> None:
        self.document_listbox.delete(0, tk.END)
        for doc in self.document_data:
            self.document_listbox.insert(tk.END, f"{doc['label']} ({doc['path']})")

    def generate_page(self) -> None:
        renderer = HTMLRenderer(self.directory)
        html = renderer.render()
        write_staff_page(html)
        messagebox.showinfo("Generation complete", "our-staff.html has been regenerated.")
        self.set_status("Staff page generated.")
        self.log_audit("Generated our-staff.html")

    def duplicate_member(self) -> None:
        if not self.current_slug:
            messagebox.showinfo("No selection", "Select a staff member to duplicate.")
            return
        category = self.category_var.get()
        member = self.directory.find(category, self.current_slug)
        if not member:
            messagebox.showerror("Not found", "Unable to locate the selected staff member.")
            return
        base_name = f"{member.name} (Copy)"
        new_name = base_name
        suffix = 1
        new_slug = slugify(new_name)
        while self.directory.find(category, new_slug):
            suffix += 1
            new_name = f"{base_name} {suffix}"
            new_slug = slugify(new_name)
        member_dict = member.to_dict()
        member_dict["id"] = new_slug
        member_dict["name"] = new_name
        member_dict["last_modified"] = iso_now()
        duplicate = StaffMember.from_dict(member_dict)
        self.directory.upsert(category, duplicate)
        self.refresh_staff_list(select_slug=new_slug)
        self.set_status(f"Duplicated {member.name}.")
        self.log_audit(f"Duplicated {member.name} as {new_name}")

    def export_json_only(self) -> None:
        self.directory.save()
        if filedialog is None:
            messagebox.showinfo("Export complete", "Directory saved to default JSON file.")
            self.log_audit("Exported staff_directory.json")
            return
        target = filedialog.asksaveasfilename(
            title="Export staff directory JSON",
            defaultextension=".json",
            initialfile="staff_directory.json",
            filetypes=(("JSON files", "*.json"), ("All files", "*.*")),
        )
        if not target:
            self.set_status("Export cancelled.")
            return
        shutil.copy2(DEFAULT_DATA_PATH, Path(target))
        messagebox.showinfo("Export complete", f"Directory exported to {target}.")
        self.set_status("Exported directory JSON.")
        self.log_audit(f"Exported staff directory to {target}")

    def log_audit(self, message: str) -> None:
        timestamp = _dt.datetime.now().strftime("%H:%M:%S")
        entry = f"[{timestamp}] {message}"
        self.audit_history.append(entry)
        # limit history to last 100 entries
        if len(self.audit_history) > 100:
            self.audit_history = self.audit_history[-100:]
        if self.audit_listbox is None:
            return
        self.audit_listbox.delete(0, tk.END)
        for item in self.audit_history[-50:]:
            self.audit_listbox.insert(tk.END, item)
        self.audit_listbox.see(tk.END)

    def _ensure_image_asset(self, path_str: str, slug: str) -> str:
        if not path_str:
            return ""
        project_path = PROJECT_ROOT / path_str
        if project_path.exists():
            try:
                rel = project_path.relative_to(PROJECT_ROOT)
            except ValueError:
                rel = path_str
            else:
                rel = str(rel)
            self.image_var.set(rel)
            return rel
        candidate = Path(path_str).expanduser()
        if not candidate.exists():
            messagebox.showerror("File not found", f"The image file '{path_str}' could not be located.")
            self.set_status("Image file not found; please choose a valid file.", error=True)
            raise ValueError("Image missing")
        stored = store_image_file(self.directory, candidate, slug)
        self.image_var.set(stored)
        self.log_audit(f"Copied headshot to {stored}")
        return stored

    def _ensure_document_assets(self, slug: str) -> List[Dict[str, str]]:
        updated: List[Dict[str, str]] = []
        for doc in self.document_data:
            label = doc.get("label", "Document")
            path_str = doc.get("path", "")
            if not path_str:
                continue
            project_path = PROJECT_ROOT / path_str
            if project_path.exists():
                try:
                    rel = project_path.relative_to(PROJECT_ROOT)
                    rel_path = str(rel)
                except ValueError:
                    rel_path = path_str
                updated.append({"label": label, "path": rel_path})
                continue
            candidate = Path(path_str).expanduser()
            if not candidate.exists():
                messagebox.showerror("File not found", f"The document '{label}' could not be located at '{path_str}'.")
                self.set_status(f"Document '{label}' not found; please reattach.", error=True)
                raise ValueError("Document missing")
            stored = store_document_file(self.directory, candidate, slug, suffix=slugify(label))
            updated.append({"label": label, "path": stored})
            self.log_audit(f"Copied document '{label}' to {stored}")
        self.document_data = updated
        return updated


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Manage the People First Urgent Care staff directory.")
    parser.add_argument(
        "--generate",
        action="store_true",
        help="Skip interaction and regenerate the staff page immediately.",
    )
    parser.add_argument(
        "--cli",
        action="store_true",
        help="Use the text-based menu instead of the GUI.",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    directory = StaffDirectory()
    ensure_directory(directory.image_dir)
    ensure_directory(directory.document_dir)

    if args.generate:
        renderer = HTMLRenderer(directory)
        html = renderer.render()
        write_staff_page(html)
        return 0

    if args.cli or tk is None:
        if tk is None and not args.cli:
            print("Tkinter is not available; falling back to CLI.")
        manager = StaffManagerCLI(directory)
        manager.run()
        return 0

    gui = StaffManagerGUI(directory)
    gui.run()
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\\nOperation cancelled by user.")
        sys.exit(1)
